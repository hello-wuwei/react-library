import { fileURLToPath } from 'node:url';
import path from 'node:path';
import glob from 'glob';
import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import eslint from '@rollup/plugin-eslint';
import rollupPluginPostcss from 'rollup-plugin-postcss';
import copy from './rollup-plugins/copy.js';
import cleaner from 'rollup-plugin-cleaner';
import rollupPostcssLessLoader from 'rollup-plugin-postcss-webpack-alias-less-loader';
import stylelint from './rollup-plugins/stylelint.mjs';

const processWorkingDirectory = process.env.PWD;
const distPath = `${processWorkingDirectory}/dist`;

const { default: rootPackageJson } = await import(`./package.json`, {
  assert: { type: 'json' },
});

const { default: packageJson } = await import(
  `${processWorkingDirectory}/package.json`,
  {
    assert: { type: 'json' },
  }
);

const externals = [
  ...Object.keys({
    ...rootPackageJson.dependencies,
    ...rootPackageJson.peerDependencies,
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  }),
];

const isWatch = process.env.ROLLUP_WATCH;

function toAbsPath(path) {
  return fileURLToPath(new URL(path, import.meta.url));
}

const packageDirNames = fs.readdirSync(
  path.relative(processWorkingDirectory, `${process.env.INIT_CWD}/packages`),
);

/**
 * ref: https://github.com/fieldju/rollup-plugin-postcss-webpack-alias-less-loader/blob/master/lib/index.js
 */
function aliasRegex(alias) {
  return new RegExp(`(@import.*?)(["'])~${alias}(["'/])(.*?;)`, 'g');
}

function replaceAliases(code, aliases) {
  Object.keys(aliases).forEach((alias) => {
    code = code.replace(aliasRegex(alias), `$1$2${aliases[alias]}$3$4`);
  });

  return code;
}

// `lessFiles` only includes files under process.pwd.
// In our use case "src/**/*.less" means less files under relevant package folder
const lessFiles = glob.sync('src/**/[!_]*.less');

const prodPlugins = [
  cleaner({
    targets: [distPath],
    silent: false,
  }),
  copy({
    targets: [
      {
        src: 'src/**/*.less',
        dest: 'dist',
        rename: (name, extension, fullPath) => {
          return `${fullPath
            .split('/')
            .slice(1, -1)
            .join('/')}/${name}.${extension}`;
        },
        transform: (contents, name, fullPath) => {
          const aliasReplacedContent = replaceAliases(contents.toString(), {
            '@@': path.relative(path.dirname(fullPath), 'src') || '.',
            ...packageDirNames.reduce(
              (acc, packageDirName) => ({
                ...acc,
                [`@mx-admin/${packageDirName}/src`]: `~@mx-admin/${packageDirName}/dist`,
              }),
              {},
            ),
          });

          return aliasReplacedContent;
        },
      },
    ],
    verbose: true,
  }),
];

export default {
  input: [`${processWorkingDirectory}/src/index.ts`, ...lessFiles],
  external: (id) => externals.some((ext) => id.startsWith(ext)),
  output: [
    {
      dir: 'dist',
      externalLiveBindings: false,
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    ...(isWatch ? [] : prodPlugins),
    stylelint({
      include: [`src/**/*.less`],
      exclude: ['**/node_modules/**/*', '**/dist/**/*'],
      files: [`${process.cwd()}/**/*.less`],
      throwOnError: true,
      fix: true,
      cwd: process.env.INIT_CWD, // 傳入自定義 cwd 讓 error 時能顯示相對於根目錄的完整路徑
    }),
    rollupPluginPostcss({
      include: ['src/**/*.less'],
      exclude: ['**/dist/*'],
      extract: true,
      modules: false,
      inject: false,
      autoModules: false,
      watch: ['src/**/*.less'],
      use: ['less'],
      loaders: [
        rollupPostcssLessLoader({
          nodeModulePath: `${process.env.INIT_CWD}/node_modules`,
          aliases: {
            '@@': 'src',
            ...packageDirNames.reduce(
              (acc, packageDirName) => ({
                ...acc,
                [`@mx-admin/${packageDirName}/src`]: `@mx-admin/${packageDirName}/dist`,
              }),
              {},
            ),
          },
        }),
      ],
    }),
    eslint({
      fix: true,
      throwOnError: true,
      include: ['**/*.ts+(|x)', '**/*.js+(|x)'],
      overrideConfig: {
        parserOptions: {
          project: isWatch ? './tsconfig.json' : './tsconfig.build.json',
        },
      },
      overrideConfigFile:
        process.env.npm_lifecycle_event === 'build-dev'
          ? toAbsPath('./eslintrc.buildDev.json')
          : undefined,
    }),
    typescript({
      tsconfig: isWatch ? 'tsconfig.json' : 'tsconfig.build.json',
      include: [
        `${processWorkingDirectory}/**/*.js+(|x)`,
        `${processWorkingDirectory}/**/*.ts+(|x)`,
      ],
      exclude: [
        `${processWorkingDirectory}/**/node_modules/**/*`,
        `${processWorkingDirectory}/**/*.test.ts+(|x)`,
        `${processWorkingDirectory}/**/*.test.js+(|x)`,
      ],
    }),

    // 目前 rollup-plugin-postcss 看似一定會產出 js 檔案，但在我們的架構下並不需要（也會產出無意義的內容）。先加個 plugin 把這些檔案移除，未來可以考慮優化流程
    {
      name: 'remove-less-js-file',
      closeBundle() {
        const lessJsFiles = glob.sync('dist/**/*.less.js');

        lessJsFiles.forEach((id) => {
          fs.unlink(id, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Successfully removed file ${id}`);
            }
          });
        });
      },
    },
  ],
  treeshake: {
    moduleSideEffects: false,
  },
  watch: {
    skipWrite: true,
    clearScreen: false,
  },
};

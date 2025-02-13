import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';

const packageNames = fs
  .readdirSync('./packages', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const baseConfig = {
  testMatch: ['<rootDir>/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>/..'],
  modulePaths: ['<rootDir>/..', '<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/..'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@mx-admin/*': ['../*/src'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),
  // 我們使用的 ahooks 依賴 lodash-es 而 jest 預設不會 transform node_modules 的內容，其中一個作法為自己寫 transformIgnorePatterns
  // ref: https://stackoverflow.com/questions/42260218/jest-setup-syntaxerror-unexpected-token-export
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};

export default {
  verbose: true,
  // use `maxWorkers: 1` to increase speed
  // ref: https://github.com/kulshekhar/ts-jest/issues/259#issuecomment-888978737
  maxWorkers: 1,
  projects: packageNames.map((packageName) => ({
    ...baseConfig,
    displayName: packageName,
    rootDir: `packages/${packageName}`,
  })),
};

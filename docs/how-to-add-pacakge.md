# 新增 packages 懶人包

請先確認新 package 所需要的環境與公用環境相同（參考[專案環境說明](./dev-env-spec.md)）。
如果都沒問題，那麼依照以下步驟新增相關檔案：

1. 新增 `packages/<package_name>/package.json`，內容如下：

```json
{
  "name": "@mx-admin/<package_name>",
  "version": "0.0.0",
  "main": "dist/index.js",
  "license": "MIT",
  "type": "module",
  "typings": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup --config ../../rollup.config.mjs",
    "build-dev": "rollup --config ../../rollup.config.mjs",
    "watch": "rollup --watch --config ../../rollup.config.mjs",
    "publish-local": "yalc publish"
  }
}
```

2. package 目錄新增 `tsconfig`s

- `tsconfig.build.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- `tsconfig.dev.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "../..",
    "baseUrl": ".",
    "outDir": "dist",
    "paths": {
      "@mx-admin/*": ["../*/src"]
    }
  },
  "include": ["src"]
}
```

- `tsconfig.json`

```json
{
  "extends": "./tsconfig.dev.json"
}
```

3. 根目錄新增部分 `scripts`

```json
{
  "scripts": {
    "build:<package_name>": "lerna run build --scope=@mx-admin/<package_name>",
    "build-dev:<package_name>": "lerna run build --scope=@mx-admin/<package_name>",
    "watch:<package_name>": "lerna run watch --scope=@mx-admin/<package_name>",
    "test:<package_name>": "jest --selectProjects <package_name>"
  }
}
```

沒有使用到單元測試的話可以不加 test command

4. 新增部署腳本
   如果該 package 需要部署，在 `bin/packages` 下新增 `<package_name>/build.sh`，並有以下內容：

```bash
mkdir app
yarn install
yarn build
cp -R packages/<package_name> app
npm publish

```

以上內容 `<package_name>` 記得都要替換成該 package 的名字唷

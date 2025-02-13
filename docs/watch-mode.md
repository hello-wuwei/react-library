# 監聽模式

本專案有 `watch` 相關的命令可以執行。監聽主要目的是讓你在檔案更新時就能提前知道是否有 compile error，但實際上並不會進行打包。

### `watch` 命令

```bash
# 監聽所有 packages 的變動
$ yarn watch
```

### `watch:*` 命令

單獨監聽 package，依照開發內容不同，可能只需要監聽幾個特定 package 即可。

### 為新增的 package 加入 watch 命令

在該 package 下的 `package.json` 中的 `scripts` 中新增 `watch` 命令，內容可以自由定義，但如果是使用根目錄中的 `rollup.config.mjs` 作為打包工具，那麼 watch 的內容即為 `rollup --watch --config <path to root rollup.config.mjs>`

### 注意事項

1. 需將要使用的 module 從 `packages/*/src/index.ts` 引入，否則檔案變更或新增並不會觸發監聽事件的更新
2. 在執行 yarn watch 之後才新增的任何 less 檔案不會觸發 watch 更新，需要手動重啟 watch。這時新增的 less 檔案就會被加進監聽清單中
3. 除了 `.{ts,js,tsx,jsx}`、`.less` 以外的檔案，並不會觸發 watch 的更新

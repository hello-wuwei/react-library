# 樣式撰寫

如果你使用公用的 compiler，在撰寫樣式時有以下注意事項：

與常見於各後台的 css-module 方式不同，本專案的 ts、js 檔案不會直接引入 less 檔案，而是保留 less 的文件結構、class name 以及變數等等。
主要考量為：

- class name 需有明確意義並且在每次打包中維持一致（css module 會 hash class name，這會造成每次打包名字都不一樣）
- 可以兼容 ant design 的樣式，所以使用 less 並且引用 `ant-prefix` 這個變數

在撰寫樣式時，需要做到：

1. 使用 ts 定義好 className
2. 如果該檔案僅為其他檔案 import 使用，請以底線開頭為檔案名。如此就不會輸出單一 css 檔案
3. class name 請遵照 BEM 模式，並使用 snake 方式撰寫，以雙底線或雙 dash 做意義區隔
4. 引用路徑 alias `@@` 即可參照到 `packages/*/src`，例如

```less
@import '~@@/_variables.less'; // 引用到 'packages/<package_name>/src/_variables.less' 這個檔案
```

5.  樣式要引用 antd class 的話，請引用 `@mx-admin/core/src/_variables.less` 裡的 `ant-prefix`，例如

```less
@import '~@mx-admin/core/src/_variables.less';

.root {
  :global .@{ant-prefix}-button {
    color: yellow;
  }
}
```

6. class name prefix 請引用 `@mx-admin/core/src/_variables.less` 裡的 `mx-prefix`，例如

```less
@import '~@mx-admin/core/src/_variables.less';

.@{mx-prefix}-placement__section {
  color: yellow;
}
```

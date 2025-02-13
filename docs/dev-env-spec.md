# 開發環境說明

本專案使用 lerna 作為管理工具，你可以自由地決定一個 package 要搭配什麼樣的環境，但大多數情況可能只需要沿用共用的內容即可。以下是說明：

### Linter

本專案以 `prettier` 搭配 `eslint` 做為 linter，相關的設定內容可以參考 `.eslintrc.json` 以及 `.prettierrc.json`。需要注意的是根目錄有另外一個檔案是 `.eslintrc.buildDev.json`。此檔案的目的在於：我們的 linter 採用相對嚴格的規範，但在開發過程中可能需要在打包時先取消部分檢查，讓當前內容可以發布到本地端給後台引用。

當新增的 package 有需要設定自己額外的 linter，只要在該 package 的目錄下新增對應的 eslint 設定檔籍可。

### `tsconfig`

本專案預設使用 TS 作為開發，但允許編寫 `js`，`jsx` 檔案一起打包。相關的 TS 設定參考根目錄的 `tsconfig.base.json`，各專案底下的 tsconfig 可以 extend 該檔案的內容。
在各專案底下可能會看到 tsconfig 有 `dev` 以及 `build` 兩種不同設定，這是因為 ts 本身有部分邏輯實作與我們的需求不符合（要做到開發時從 `src` 引用而 bundle 完從 `dist` 引用），因此 `dev` 檔案是讓我們的 IDE 以及 linter 可以正確判讀，而 `build` 檔案則確保輸出的內容沒有問題。

### Bundler

本專案使用 rollup 作為公用打包工具，但如果你有需要，使用 webpack 或是自己寫一個 build script 也都是沒有問題的。
公用的 bundler 做的事情比較多，以下一一說明：

1. js/ts 打包

- 設為 `preserveModule`。因為我們是第三方模組，會期望輸出的內容可以維持文件結構並具有 tree-shakeable 的能力。
- 所有的 import 來源設為 external，不會將這些外部程式碼一起打包
- 代碼內容會 compile 成 es3 可兼容的內容，因為後台環境大多無法支援太新的 ecma script 內容

2. css/less 檔案處理

- 公用的 bundler **不採用 css module**，因此不可直接引入 less/css 檔案。
- 公用的 bundler 會將現有的 less 檔案 compile 成一隻獨立的 css 檔案
- 公用的 bundler 會將現有的 less 檔案拷貝到 `packages/*/dist` 目錄，但將 path alias 替換為正確的路徑。這是由於 ant design 可以修改變數，為了與後台同步這個行為，我們傾向於在後台引入 less 檔案而不是 css 檔案。

更詳細的說明可以參考[樣式撰寫](./coding-css.md)

### Test

我們使用 `jest` 作為我們的測試工具，且跑 command 不會透過 lerna。預設會包含所有檔名為 `.(spec|test).(t|j)sx?` 的檔案。

### 依賴項目

本專案允許擁有自己的依賴宇宙，但是部分依賴項目因為後台環境的現況而列在了 `peerDependencies`：

- `react`、`react-dom`、`react-router`、`history`：在 umi v2 的 webpack 設定中，這幾個項目有被列為 alias 而會強制跟隨後台的版本，所以列為 peer 並以後台現行版本為主。**新增其他依賴項目時，請注意該依賴如果依賴以上，要能兼容到舊版本**
- `antd`：ant-design 因為以下而列為 peer
  - 4.21.3 之前與之後有 breaking change 但官方未提及，停留在 4.21.2 以維持大家到目前為止的開發習慣
  - antd v5 依賴的 react 版本高於後台現行版本，且以 dayjs 替換 moment 作為核心工具，相關的 breaking change 有點多，需等更詳細的評估後才來決定是否應用
- `i18next`：因為 `useLocation` 吃的 i18n instance 預設是從 module 來的，在大多情況下我們需要保持 instance 與後台一致，因此 i18next 為 peer

### Commit

遵循 [Angular Commit 規範](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)，會依照 commit 內容產出 `CHANGELOG.md`。
建議使用本專案提供的命令 `commit`([ref](./commands.md)) 來產出 commit 內容，如果有相關 jira 單號請在 commit subject 加入。範例：feat(placement): #1234 新增客製化內容。

**請務必將 commit 依照不同的 packages 做切分**，習慣用 command 來做 git 處理的人，請多使用 `git rebase -i` 以及 `git add -p` 來整理你的 commit。

### Version Bump、Changelog and Publish

版號控制、Changelog 生成以及發布上線的流程，因為公司現有流程的限制，我們有做一些個別處理，換句話說我們並沒有完全依照 `lerna version` 的預設流程來走。大部分情況下應該都會依照公用設定來走，以下詳細說明：

#### Version Bump

當我們準備提 PR 一直到發布上線前，都需要去升級依賴版號。除了 repo 管理者會在測試結束時下 `prepare-publish` 以外，開發完成發 PR 前、測試中修正完問題、需求變更等等都用 `prepare-rc-publish` 來升級版號。測試用版號會用 `rc` 來表示。版號會自動依照 commit 內容來決定。

#### Changelog generation

僅在 `prepare-publish` 時執行。

#### Publish

lerna 預設的流程是會在下 `lerna version` 時打 tag 並發布，但由於我們的流程不一樣，需要走人工審核以及發布，所以我們僅用 `lerna version` 來處理 version bump 以及產 changelog。

**任何發布都需要找 repo 管理者下 tag 後，找魯班上有業務負責人權限的人幫忙部署**

**Note**：我們取消 lerna 打 tag 的方式是將 `lerna.json` 中 `commit.version.gitTagCommand` 改為 echo 隨意的內容來覆蓋 lerna 的預設命令。

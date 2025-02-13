# 部署流程說明

### Pull Request

1. mx-admin 在開發完準備發 PR 時，請在 mx-admin 環境使用 `yarn prepare-rc-publish` 並將產出的 commit 一併推到 remote 上。
2. **後台環境**請使用 `remove-local-mx-admin` 將本地開發的內容移除。此時的 PR 暫時不更新 mx-admin 版號沒關係，但需要在部署前將要使用的版號更新到 PR 中

### 聯調、測試階段部署

1. 確保 mx-admin 中的 PR 已經包含 `prepare-rc-publish` 腳本產出的 release commit
2. 請 repo 管理員為你即將部署的內容打一個 tag 並請魯班的業務管理員部署（通常測試人員會有該權限）
3. mx-admin 需注意部署順序，被依賴的那方需要先部署。依賴關係可透過 `package-graph` 來查看。
4. 待 mx-admin 部署完成後，**後台環境**中將需要的 mx-admin module 更新為最新的版號，並記得 `yarn` 一遍更新 `yarn.lock`
5. 假如 mx-admin 已經部署過了但需要進行修改後重新部署，這時透過 `prepare-rc-publish` 產出的版本已經存在並無法在魯班上覆蓋，因此需要：
   - 將上一個 chore: release 的 commit reset 掉
   - 手動下命令 `yarn lerna version <your_target_version> --no-push --conventional-commits --no-changelog` 產出新的版號
   - 以上萬一太麻煩，也是可以透過一直下 `prepare-rc-publish` 直到版本正確後，再把先前已經用過的 release commit drop 掉
6. 如果有執行第五步驟，請在**後台環境**重複第四步驟

### 測試完畢準備發布正式版

1. 請 mx-admin repo 管理員於 mx-admin 專案環境下執行 `yarn prepare-publish` 將版號換為正式版號
2. 待測試發布完 mx-admin 內容後，請**後台**管理者於**後台環境**中執行 `yarn add` 將 mx-admin 依賴項目更新為正式版號後，打上 release 用的 tag 並請測試繼續**後台**的發布流程

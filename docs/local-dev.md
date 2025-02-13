# 本地開發

本專案沒有設置開發伺服器，因此需要搭配 [yalc](https://github.com/wclr/yalc) 套件以及預寫好的腳本將 packages 安裝到後台當中進行開發。

### 全域安裝 `yalc` 套件

```bash
$ npm add -g yalc
```

### 透過 yalc 安裝腳本包

1. 在本專案環境下執行：

   ```bash
   $ yarn build
   ```

   或者 - 如果有想要看 console.log 的資訊可以使用

   ```bash
    $ yarn build-dev
   ```

   ```bash
   $ yarn publish-local --scope=@mx-admin/scripts
   ```

2. 在後台專案環境下安裝 `@mx-admin/scripts`：

   ```bash
   $ yarn add -D @mx-admin/scripts
   ```

   或是只想暫時安裝，可以透過 `yalc`

   ```bash
   $ yalc add @mx-admin/scripts
   ```

3. 新增後台命令及 `.gitignore`（如果該後台已經新增過命令，可以跳過）：

   - `package.json` 新增 scripts

     ```json
     {
       "scripts": {
         "add-local-mx-admin": "node node_modules/@mx-admin/scripts/src/yalc-add.mjs",
         "remove-local-mx-admin": "node node_modules/@mx-admin/scripts/src/yalc-remove.mjs"
       }
     }
     ```

   - `.gitignore` 新增

     ```
     # yalc
     .yalc
     yalc.lock
     mx-admin-local-yalc.json
     ```

4. 透過預設的腳本安裝所需的 @mx-admin packages：

   ```bash
   $ yarn add-local-mx-admin @mx-admin/core @mx-admin/placement
   ```

   此腳本會附帶安裝該 package 的依賴項目，並改寫 `package.json` 中的 `resolutions` 內容，讓你的程式可以仿照真實情境運作。

### 移除本地內容

透過剛剛新增的 `remove-local-mx-admin` 命令來移除：

```bash
$ yarn remove-local-mx-admin @mx-admin/core @mx-admin/placement
```

如果要移除全部也可以不帶參數：

```bash
$ yarn remove-local-mx-admin
```

NOTE:

1. 該 package 的依賴項目如果沒有被其他 package 引用，也會一併被移除。
2. 無法透過 remove-local-mx-admin 移除自動新增的依賴 package
3. 如果在新增項目前已是依賴項目，移除時會將版號復原

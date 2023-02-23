# expense-tracker

![expense-tracker](https://user-images.githubusercontent.com/113798606/221044748-4f601788-c1d8-4610-8ad5-610334bf11e7.png)

## 功能
+ 登入系統可建立自己的帳號
+ 可使用臉書帳號做第三方登入
+ 可以新增、修改、刪除支出紀錄
+ 可以依照類別篩選要顯示的項目


## 開始使用

1. 請先安裝node.js以及npm
2. 使用終端機將專案複製到本地
```
git clone https://github.com/YuZheLin1987/expense-tracker.git
```
3. 使用終端機進入資料夾的位置，安裝相關套件
```
cd expense-tracker
npm install
```
4. 設定環境變數
  + 在資料夾新增.env檔案
  + MACos可直接建立檔案。WINDOWSos存檔時檔案類型請選擇 **所有檔案 / ALL FILES** ，避免建立成文字檔txt
  + 內容請參考.env.example，填入SKIP的部份
  + MONGODB_URI 請輸入您的mongodb連線網址
  + FACEBOOK 相關請到Facebook for developers 註冊應用程式，開啟登入功能。取得編號(FACEBOOK_ID)及密鑰(FACEBOOK_SECRET)
5. 寫入種子資料
```
npm run seed
```
  + 成功執行完畢會看到“categorySeeder done!”以及“recordSeeder done!”

6. 執行程式
```
npm run start
```
7. 成功時終端機會顯示
```
This express server is running at http://localhost:3000
mongodb connected!
```
8. 到瀏覽器輸入下列網址：http://localhost:3000
9. 結束請在終端機輸入ctrl+c

## 使用工具
+ Node.js@16.17.1
+ Express@4.17.1
+ 詳細請到package.json參考

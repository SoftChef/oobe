# oobe version

## ver 0.0.3

正式定義架構

## ver 0.0.4

1. 移除watch屬性：這東西對後端來說太危險了
2. 移除bridge：考慮使用event來取代
3. reset & isChange 可以針對key來做微調
4. helper verify：一個簡單的驗證功能

## ver 0.0.5

1. 加入interface

## ver 0.0.6

1. 加入$bind
2. 優化程式碼

## ver 0.0.7

1. 修復$rule
2. 加入instanceof

## ver 0.0.8

1. 加入$raw
2. 加入helper deepObjectAssign

## ver 0.0.9

1. 驗證預設允許為空值
2. rule新的表示法
3. 修復verify的預設值無法回傳0, false, ''等錯誤

## ver 0.1.0

1. validateForSprite指定某個sprite的驗證規則

## ver 0.1.1

1. self

## ver 0.1.2

1. 修正json parse對於undefined的錯誤
2. $distortion縮寫$dist
3. event
4. collection
5. 區分系統錯誤與開發者錯誤
6. helper generateId

## ver 0.1.3

1. 忘記編譯，笑惹

## ver 0.1.4

1. 在born之前不會有raw data這個屬性

## ver 0.1.5

1. Default View

## ver 0.1.6

1. collection write

## ver 0.1.7

1. 更新readme

## ver 0.1.8

1. sprite $put
2. sprite $toObject
3. export 指定name之外還能傳遞數值

## ver 0.1.9

1. 移除 collection list
2. 新增 collection items
3. 新增 collection wirteSuccess event
4. 新增 collection dirty

## ver 0.2.0

1. 新增官方包

## ver 0.2.1

1. onOnce
2. sprite export event
3. 修正toObject 沒有辦法拿到views的錯誤
4. event移除實驗狀態
5. instanceof找不到對象時擲出錯誤
6. collection write 或 batchWrite 只要觸發就會更動 dirty屬性

## ver 0.2.2

1. 設定語系為null時會採取en-us
2. collection允許直接寫入精靈
3. 實例化的oobe core也有helper的接口了，目的是Container install沒有verify可以用很不方便...

## ver 0.2.3

* 0.2.3將state轉名為dist，這過程有點痛R，主要是因為distortion是主動轉換，但state比較像是被動轉換

1. collection write取代能觸發vue的反應
2. 新的error狀態
3. 新的$error event

## ver 0.2.4

1. getType新增promise and buffer
2. helper peel
3. $views縮寫$v可以使用

## ver 0.2.5

1. 可以藉由$parent獲取被參考者的狀態
2. 重構部分程式碼
3. 把文件缺失的部分都補齊了
4. 針對不支援proxy的瀏覽器會無視defView
5. 移除collection實驗性狀態

## ver 0.2.6

1. refs collection
2. collection views
3. collection validate
4. collection forEach
5. collection isChange
6. collection getBodys
7. collection distAll
8. collection methods
9. collection batchWriteAsync
10. collection configs
11. collection utils
12. collection parent
13. collection helper
14. container collectionMethods
15. 移除 validateForSprite ，這方法導致無法整合collection

## ver 0.2.7

1. 更新文件

## ver 0.2.8

* 開始翻譯的程序

1. collection setDirty
2. collection 的文件翻譯成英文
3. batch write only key

## ver 0.2.9

1. 不允許body的資料是個function(本來就不行 但檢查更嚴格)
2. 移除collection沒使用的options
3. 將document全部轉為英文
4. readme to english
5. defview 的判定從!轉成判定null

## ver 0.3.1

1. 新增實驗性功能plugin
2. 新增系統plugin - loader

## ver 0.3.2

1. collection允許source為array
2. collection toKey(sprite)
3. loader加入called屬性
4. loader和reset事件綁定

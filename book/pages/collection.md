# Collection

*🔬Collection是一個實驗性功能，我們將頻繁更動且需要您的回饋。*

## 建立一個集合

集合已精靈為單位，因此屬性宣告在精靈內。

### 定義集合

```js
let sprite = {
    body() {
        return {
            name: ''
        }
    },
    methods: {
        foo() {
            return 'bar'
        }
    },
    collection: {
        key: sprite => sprite.name,
        write({ key, sprite, success, reject }) {
            if (key.name !== '') {
                return success()
            }
            reject('Name is empty.')
        }
    }
}
```

`Key`是唯一對象，當回傳值的Key相同則取代。

當省略key時會宣告為`*`，意味著所有資料被寫入都會創建一筆新的精靈。

### 建立集合

```js
let oobe = new Oobe()
oobe.join('demo', { sprites: { sprite } })
let collection = oobe.collection('demo', 'sprite')
```

### 存取對象

存入

```js
collection.write({
    name: '1234'
})
```

獲取

```js
let sprite = collection.fetch('1234')
sprite.$fn.foo() // bar
```

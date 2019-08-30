# Collection

## 定義集合

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
            if (key !== '') {
                return success()
            }
            reject('Name is empty.')
        },
        views: {
            totalNames() {
                let name = []
                // collection this指向collection本身
                this.forEach((sprite) => {
                    name.push(sprite.name)
                })
                return name
            }
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

也可以直接寫入sprite

```js
let sprite = oobe.make('demo', 'sprite').$born({ name: '1234' })
collection.write(sprite)
```

獲取

```js
let sprite = collection.fetch('1234')
sprite.$fn.foo() // bar
```

## 在精靈定義Refs對象

```js
let sprite = {
    body() {
        return {
            name: ''
        }
    },
    refs: {
        noCollection: 'collection', // 這會建立精靈
        collection: '[collection]', // 這會建立collection
    }
}
```
## Collection

Collection是Sprite的集合，專職在批次處理與列表顯示。

* 定義鍵值：[Key](#key)
* 驗證方法：[Write](#write)、[WriteAfter](#writeafter)
* 私有方法：[Methods](#methods)、[Views](#views)
* 狀態管理：[Loader](#loaders)

---

### Sprite

Collection與[Sprite](../sprite/structure.md)是共生關係，所有的Collection都必須運作於其下。

```js
// 建立collection
let collection = {
    key: sprite => sprite.name
}
// 建立sprite
let sprite = {
    body() {
        return {
            name: ''
        }
    },
    // collection必須建立在sprite內
    collection
}
// 建立container
let container = {
    sprites: {
        sprite
    }
}
// 註冊進core
oobe.join('container', container)
```

---

### Collection

Core實體化Collection的方法：

```js
let collection = oobe.collection('container name', 'sprite name', options)
```

#### Options

Collection並不具有自己的Options，而是寫入Sprite的[Options](../sprite/structure.md#save)。


```js
oobe.collection('container name', 'sprite name', {
    save: true
})
```

#### 加入Sprite

使用[`write`](./operational.md#write)寫入Sprite於Collection：

```js
let users = oobe.collection('container name', 'sprite name')
users.wirte({
    name: 'steve'
})
console.log(users.fetch('steve').name) // steve
```

---

### 定義結構

#### Key

Collection可以指定唯一值，如果Key相同時執行[`write`](./operational.md#write)會複寫該Sprite。

> 如果不指定則會隨機產生一組id。

```js
let collection = {
    // ...
    // 回傳指定的key值
    key: sprite => sprite.name
    // ...
}
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| sprite        | sprite  | 寫入時實例化的精靈       |

---

### 驗證方法

#### Write

有時候需要許多的條件才允許被寫入Collection，該規則可以在Write實現：

```js
let collection = {
    // ...
    write(context) {
        if (context.key == null) {
            context.reject('Name not found.')
        } else {
            context.success()
        }
    }
    // ...
}
```

| Param           | Type                          | Description           |
| ---             | ---                           | ---                   |
| context         | object                        | _No description_      |
| context.key     | string                        | 寫入時指定的Key         |
| context.sprite  | sprite                        | 寫入時實例化的精靈       |
| context.reject  | function(rejectMessage: any)  | 拒絕這次寫入            |
| context.success | function                      | 接受這次寫入            |

#### WriteAfter

觸發Write成功後會再執行WriteAfter：

```js
let collection = {
    // ...
    writeAfter(context) {
        // do something
    }
    // ...
}
```

| Param           | Type                          | Description           |
| ---             | ---                           | ---                   |
| context         | object                        | _No description_      |
| context.key     | string                        | 寫入時指定的Key         |
| context.sprite  | sprite                        | 寫入時實例化的精靈       |

---

### 私有方法

跟[Sprite](../sprite/structure.md)一樣有自己的Methods與Views。

#### Methods

以Collection為對象的方法集：

```js
let collection = {
    // ...
    methods: {
        getNames(prefix = '') {
            return this.items.map(sprite => prefix + sprite.name)
        }
    }
    // ...
}
// ...
let users = oobe.collection('container name', 'sprite name')
users.wirte({ name: 'dave' })
users.wirte({ name: 'steve' })
console.log(users.methods.getNames('name - ')) // ['name - dave', 'name - steve']
```

#### Views

基於Getter的模式呈現資料的方法：

```js
let collection = {
    // ...
    views: {
        names() {
            return this.items.map(sprite => sprite.name)
        }
    }
    // ...
}
// ...
let users = oobe.collection('container name', 'sprite name')
users.wirte({ name: 'dave' })
users.wirte({ name: 'steve' })
console.log(users.views.names) // ['dave', 'steve']
```

---

### 狀態管理

#### Loaders

與[Sprite Loaders](../sprite/structure.md#loaders)相同，僅差異在指向對象為Collection。

```js
let collection = {
    // ...
    loaders: {
        fetch(done, reject) {
            ajax(`getUsers`)
                .then(items => {
                    this.collection.batchWrite(items)
                    done()
                })
        }
    }
    // ...
}
// ...
user.loaders.fetch.start().then(() => { ... })
```

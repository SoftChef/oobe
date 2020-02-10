## Collection Operational

Collection大量內置了操作功能與狀態，免除複雜且難以維護的繼承樹。

* CRUD：
  * [`has`](#has)
  * [`fetch`](#fetch)
  * [`write`](#write)
  * [`batchWrite`](#batchwrite)
  * [`batchWriteOnlyKeys`](#batchwriteonlykeys)
  * [`batchWriteAsync`](#batchwriteasync)
  * [`remove`](#remove)
  * [`clear`](#clear)
* 事件處理：
  * [`on`](#on)
  * [`off`](#off)
  * [`onOnce`](#ononce)
  * [`emit`](#emit)
* 視圖呈現：
  * [`size`](#size)
  * [`dirty`](#dirty)
  * [`loaders`](#loaders)
  * [`setDirty`](#setdirty)
  * [`isChange`](#ischange)
* 資料處理：
  * [`items`](#items)
  * [`forEach`](#foreach)
  * [`getBodys`](#getbodys)
  * [`getOrigins`](#getorigins)
  * [`getExports`](#getexports)
  * [`validate`](#validate)
  * [`distAll`](#distall)
* 私有方法：
  * [`views`](#views)
  * [`methods`](#methods)
* 其他：
  * [`utils`](#utils)
  * [`configs`](#configs)
  * [`helper`](#helper)
  * [`parent`](#parent)
  * [`toKey`](#tokey)

---

### CRUD

#### has

指定`key`對象有無存在。

```js
collection.has(key) => Boolean
```

| Param    | Type    | Description |
| ---      | ---     | ---         |
| key      | string  | Target key. |

#### fetch

獲取指定`key`對象。

```js
collection.fetch(key) => Sprite || null
```

| Param    | Type    | Description |
| ---      | ---     | ---         |
| key      | string  | Target key. |

#### write

寫入一個Sprite。

```js
collection.write(source) => null
```

| Param    | Type    | Description  |
| ---      | ---     | ---          |
| source   | any     | Origin data. |

#### batchWrite

批次寫入Sprite。

```js
collection.batchWrite(items) => null
```

| Param    | Type    | Description  |
| ---      | ---     | ---          |
| items    | array   | Origin data. |

#### batchWriteOnlyKeys

批次寫入精靈，但只有`key`。

```js
collection.batchWriteOnlyKeys(key, items) => null
```

| Param    | Type            | Description  |
| ---      | ---             | ---          |
| key      | string          | Key name.    |
| items    | array           | Origin data. |

##### 可以應用指定的key再去獲取個別資料

```js
collection.on('$writeSuccess', (context, { sprite, onlyKey }) => {
    if (onlyKey) {
        sprite.fetch( ... )
    }
})
```

#### batchWriteAsync

由於牽扯到大量的視圖邏輯，oobe並不擅長處理大量的資料，當開發人員寫入時畫面出現卡頓但仍想使用Collection，可以採用該方法進行非同步批次寫入：

```js
collection.batchWriteAsync(items, ms, parallel) => null
```

| Param             | Type    | Description  |
| ---               | ---     | ---          |
| items             | array   | Origin data. |
| [ms = 2]          | number  | 每次寫入隔間   |
| [parallel = 1]    | number  | 同時間寫入數量 |

##### 使用事件監聽寫入完畢

```js
collection.on('$writeAsyncDone', () => { ... })
```

#### remove

移除指定`key`對象。

```js
collection.remove(key) => null
```

| Param    | Type    | Description |
| ---      | ---     | ---         |
| key      | string  | Target key. |

#### clear

清除所有資料。

```js
collection.clear() => null
```

---

### 事件處理

#### on

監聽一則[Event](../core/event.md)。

```js
collection.on(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### off

關閉監聽事件。

```js
collection.off(eventName, id) => null
```

| Param     | Type    | Description             |
| ---       | ---     | ---                     |
| eventName | string  | Event name.             |
| id        | string  | Listener id.            |

#### $onOnce

監聽的事件只觸發一次。

```js
collection.onOnce(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### emit

發送事件。

```js
collection.emit(eventName, ...args) => null
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| ...args   | args     | Emit items.             |

---

### 視圖呈現

#### size

獲得現在的資料長度。

```js
collection.size => Number
```

#### dirty

是否觸發過寫入資料，只要觸發`write`、`batchWrite`、`batchWriteOnlyKeys`、`batchWriteAsync`這幾個事件`dirty`的狀態就會切換成`true`。

```js
collection.dirty => Boolean
```

#### loaders

狀態控制單元，詳情請見[Loaders](./structure.md#loaders)。

```js
collection.loaders => Object
```

#### setDirty

更動`dirty`狀態。

```js
collection.setDirty(status) => null
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| status    | boolean  | _No description_        |

#### isChange

Collection內部的Sprite是否有被更動過屬性。

> 這並不是只原始長度是否改變過。

```js
collection.isChange() => Boolean
```

---

### 資料處理

#### items

Collection的陣列結構。

```js
collection.items => Array<Sprite>
```

#### forEach

迭代Collection的陣列結構。

```js
collection.forEach(callback) => null
```

| Param     | Type                     | Description             |
| ---       | ---                      | ---                     |
| callback  | function(sprite, index)  | _No description_        |

##### 中斷迭代

`callback`中回傳`_break`即可中斷整個迭代。

```js
collection.forEach(sprite => {
    if (sprite.name === 'steve') {
        return '_break'
    }
})
```

#### getBodys

宣告所有Collection內部的Sprite執行`$body()`並回傳陣列結構。

```js
collection.getBodys() => Array<Object>
```

#### getOrigins

宣告所有Collection內部的Sprite執行`$origin()`並回傳陣列結構。

```js
collection.getOrigins() => Array<Object>
```

#### getExports

宣告所有Collection內部的Sprite執行`$export()`並回傳陣列結構。

```js
collection.getExports(name, ...args) => Array<Object>
```

| Param     | Type   | Description             |
| ---       | ---    | ---                     |
| name?     | string | 可以指定輸出狀態           |
| ...args?  | ...any | export的參數             |

#### validate

觸發Collection內部所有Sprite的`$validate`並回傳`result`。

```js
collection.validate() => { success: Boolean, result: Array<String> }
```

#### distAll

觸發Collection內部所有Sprite的`$dist`。

```js
collection.distAll(name) => null
```

| Param     | Type   | Description             |
| ---       | ---    | ---                     |
| name      | string | Distortion name.        |

---

### 私有方法

#### views

經過計算的唯讀屬性，詳情請見[Views](./structure.md#views)。

```js
collection.views => Object
```

#### methods

使用[Methods](./structure.md#methods)的接口。

```js
collection.methods => Object
```

---

### 其他


#### helper

[Helper](../tools/helper.md)的接口。

```js
collection.helper => Helper
```

#### configs

該對象會指向[Container](../core/container.md#configs)的`configs`。

```js
collection.configs => Object
```

#### parent

如果該Collection是來自[Refs](../sprite/structure.md#refs)的參照對象時指向其參照者。

```js
collection.parent => Sprite
```

##### exampale

```js
let sprite = {
    // ...
    body() {
        return {
            name: 'steve'
        }
    },
    refs: {
        // 使用[]包覆起來就是宣告collection
        'sprite2': '[sprite2]' 
    }
    // ...
}
let sprite2 = {
    // ...
}
let container = {
    sprites: {
        sprite,
        sprite2
    }
}
// ...
let user = oobe.make('...', 'sprite')
console.log(user.sprite2.parent.name) // 'steve'
```

#### utils

回傳[Container](../core/container.md#utils)的`utils`對象。

```js
collection.utils => Object
```

#### toKey

將一個物件執行Collection的[Key](./structure.md#key)並回傳。

```js
collection.toKey(target) => String
```

| Param     | Type   | Description             |
| ---       | ---    | ---                     |
| target    | any    | Target.                 |

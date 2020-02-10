## Helper

Helper提供了一些簡易的方法協助優化程式碼。

  * [`jpjs`](#jpjs)
  * [`getType`](#gettype)
  * [`isEmpty`](#isempty)
  * [`verify`](#verify)
  * [`deepObjectAssign`](#deepobjectassign)
  * [`generateId`](#generateid)
  * [`peel`](#peel)
  * [`mapping`](#mapping)
  * [`setNull`](#setnull)

---

### How To Use

在Sprite中：

```js
let sprite = oobe.make('container', 'sprite')
console.log(sprite.$helper) // functions
```

在Collection中：

```js
let collection = oobe.collection('container', 'sprite')
console.log(collection.helper) // functions
```

全局使用：

```js
import Oobe from 'oobe'
console.log(Oobe.helper) // functions
let oobe = new Oobe()
console.log(oobe.helper) // functions
```

---

### jpjs

意思為`JSON.parse(JSON.stringify(obj))`，一個js歷久不衰的數值拷貝方法。

```js
oobe.helper.jpjs(data) => Object
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| data     | object  | Can to JSON object.     |

##### exampale

```js
let a = { b: 5 }
let b = oobe.helper.jpjs(a)
b.b = 7
console.log(a.b) // 5
console.log(b.b) // 7
```

---

### getType

獲取類型，能獲取比`typeof`更多的屬性。

```js
oobe.helper.getType(data) => String
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| data     | any     | Target data.            |

##### exampale

```js
// 除了底下這些例子外，其他皆回傳typeof的值
oobe.helper.getType([]) // array
oobe.helper.getType(NaN) // NaN
oobe.helper.getType(null) // empty
oobe.helper.getType(undefined) // empty
oobe.helper.getType(/test/) // regexp
oobe.helper.getType(new Promise(() => {})) // promise
oobe.helper.getType(Buffer.from('123')) // buffer
```

---

### isEmpty

是否為空，這裡的空涉略範圍甚廣。

```js
oobe.helper.isEmpty(data) => Boolean
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| data     | any     | Target data.            |

##### exampale

```js
oobe.helper.isEmpty({}) // true
oobe.helper.isEmpty([]) // true
oobe.helper.isEmpty('') // true
oobe.helper.isEmpty(null) // true
oobe.helper.isEmpty(undefined) // true
oobe.helper.isEmpty(0) // false
```
---

### verify

驗證並回傳包含預設值的新結果。

> Allow Types的項目請參照[`getType`](#gettype)。

```js
oobe.helper.verify(data, verify) => Object
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| data     | any     | Target data.            |
| verify   | object  | Verify data.            |

##### exampale

```js
let options = {
    a: 5,
    b: []
}
let data = oobe.helper.verify(options, {
    // [required, allow types, default value]
    a: [true, ['number']],
    b: [true, ['array']],
    c: [false, ['number'], 0]
})
console.log(data.a) // 5
console.log(data.c) // 0
```

---

### deepObjectAssign

ObjectAssign更細項的處裡。

```js
oobe.helper.deepObjectAssign(target, source) => Object
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| target   | object  | Target data.            |
| source?  | object  | Source data.            |

##### exampale

```js
let target = {
    a: 5,
    b: 10,
    c: {
        a: 7,
        b: 8
    }
}
let output = oobe.helper.deepObjectAssign(target, {
    a: 8,
    c: {
        a: 10
    }
})
console.log(output.a) // 8
console.log(output.b) // 10
console.log(output.c.a) // 10
console.log(output.c.b) // 8
```

---

### generateId

產生一組仿uuid隨機字串。

```js
oobe.helper.generateId() => String
```

##### exampale

```js
let text = oobe.helper.generateId()
console.log(text) // f1c5aaaa-a8a8-4394-9bcf-3272678efbb7
```

---

### peel

可以獲得指定的路徑對象的值，找不到回傳undefined，可以參照[可選鍊](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE)。

```js
oobe.helper.peel(target, path) => any || undefined
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| target   | object  | Target data.            |
| path     | string  | Target chaining.        |

##### exampale

```js
let a = {
    b: {
        c: {
            d: 5
        }
    }
}
console.log(peel(a, 'b.c.d')) // 5
```

---

### mapping

指定Key By Key的轉換。

```js
oobe.helper.mapping(keyMap, target, options) => Object
```

| Param            | Type           | Description                                        |
| ---              | ---            | ---                                                |
| keyMap           | object         | Map data.                                          |
| target           | object         | Target data.                                       |
| options          | object         | _No description_                                   |
| options.isModel? | body or origin | 對象是Sprite或Collection則自動轉換成`body`或`origin`。 |
| options.reverse? | boolean        | 反向映射                                             |

##### exampale

```js
var keyMap = {
     a: 'A',
     b: 'B'
}
var target = {
     A: 5,
     B: 3
}
let output = mapping(keyMap, target)
console.log(output.a) // 5
console.log(output.b) // 3
```

---

### setNull

建立一個對應Key的物件但值為null。

```js
oobe.helper.setNull(target) => Object
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| target   | object  | Target data.            |

##### exampale

```js
let target = {
    a: {},
    b: 5
}
let output = setNull(target)
console.log(target.b) // 5
console.log(object.a) // null
console.log(Object.keys(output)) // ['a', 'b']
```

此功能主要是搭配[`mapping`](#mapping)使用，只要定義一個KeyMap就行了。

```js
let keyMap = {
    name: 'Name'
}

let mySprite = {
    body() {
        return this.$helper.setNull(keyMap)
    },
    born(source = {}) {
        return this.$helper.mapping(keyMap, source)
    },
    origin() {
        return this.$helper.mapping(keyMap, this, {
            isModel: 'origin',
            reverse: true
        })
    }
}
```

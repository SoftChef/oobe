# Helper

Helper提供了一些簡易的方法協助優化程式碼，但也僅止於如此。

## 如何使用

在sprite中：

```js
let sprite = oobe.make('container', 'sprite')
console.log(sprite.$helper) // functions
```

全局使用：

```js
import oobe from 'oobe'
console.log(oobe.helper) // functions
```

## Functions

### jpjs(object)

意思為`JSON.parse(JSON.stringify(obj))`，一個js歷久不衰的數值拷貝方法。

```js
object 'required' {any}
return object
```

```js
let a = { b: 5 }
let b = oobe.helper.jpjs(a)
b.b = 7
console.log(a.b) // 5
console.log(b.b) // 7
```

---

### getType(target)

獲取類型，能獲取比`typeof`更多的屬性。

```js
object 'required' {any}
return string
```

```js
// 除了底下五種例子外，其他皆回傳typeof的值
oobe.helper.getType([]) // array
oobe.helper.getType(NaN) // NaN
oobe.helper.getType(null) // empty
oobe.helper.getType(undefined) // empty
oobe.helper.getType(/test/) // regexp
```

---

### isEmpty(target)

是否為空，這裡的空涉略範圍甚廣。

```js
object 'required' {any}
return string
```

```js
oobe.helper.isEmpty({}) // true
oobe.helper.isEmpty([]) // true
oobe.helper.isEmpty('') // true
oobe.helper.isEmpty(null) // true
oobe.helper.isEmpty(undefined) // true
oobe.helper.isEmpty(0) // false
```

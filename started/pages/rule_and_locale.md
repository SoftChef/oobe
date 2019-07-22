# 規則與語系

## 規則(Rule)

規則是一連串的驗證方法，試著將值傳給一個方法(function)，並回傳`true`(成功)或是錯誤訊息。

> 不建議使用箭頭函數，所有驗證方法皆會將`this`指向給呼叫驗證的`sprite`。

```js
function number(value) {
    let type = this.$helper.getType(value)
    return type === 'number' ? true : 'Value not a number'
})
```

---

### 在core安裝rule

`oobe`不允許直接建立一則`rule`，必須藉由`addon`導入一組組件來進行擴展，試著把剛剛定義的`number`驗證加入組件。

```js
oobe.addon({
    name: 'pk',
    rules: {
        number
    }
})
```

---

### 參數

Rule可以接受簡單的參數來賦予更靈活的宣告方法，在宣告指定對象後，接著輸入 `|` 切割參數，使用 `:` 定義值，例如`max|value:20`，獲取的對象將傳遞給第二個參數。

```js
function max(value, params) {
    if (params.value && value > Number(params.value)) {
        return `Value more then ${params.value}.`
    }
    return true
}
```

---

### 在container建立私有rule

並不是所有的驗證方法都能滿足所有狀況，container可以自定義一組規則，這次我們可以把max加進container中。

```js
let container = {
    rules: {
        max
    }
}
```
---

### 所有的方法都會忽略空值

空值不做驗證，可以用以下方法使空值也做檢查。

> 空值的定義可以參考[helper.isEmpty](./helper.md)

```js
let container = {
    rules: {
        max: {
            handler: max,
            allowEmpty: false
        }
    }
}
```

---

### 開始驗證

所有的驗證對象都是sprite，因此仍要建立一個精靈。

> 使用`addon`加入的規則皆需要遵照以下方法`#{name}.{key}`

> 在同一個`container`下，所屬的私有方法可以省略前墜。

```js
let sprite =  {
    body() {
        return {
            age: 0
        }
    },
    rules: {
        age: ['#pk.number', 'max|value:20']
    }
}
```

由上方例子可得知`age`這個屬性需要是number，且最大值無法超過20，接下來開始正式驗證。

```js
container.sprites = { sprite }
oobe.join('demo', container)
let teen = oobe.make('demo', 'sprite').$born({ age: 18 })
let old = oobe.make('demo', 'sprite').$born({ age: 88 })
console.log(teen.$validate().success) // true
console.log(old.$validate().success) // false
```

### 針對精靈驗證

在有些情況下我們需要了解手上的資料是否符合精靈的規則，而非從精靈實體化來。

```js
let result = oobe.validateForSprite('demo', 'sprite', { age: 18 })
console.log(result.success) // true
```

---

## 語系(Locale)

`oobe`提供了基礎的語系系統，提供良好的展示功能。

```js
let locales = {
    'en-us': {
        'hw': 'hello world.'
    },
    'zh-tw': {
        'hw': '你好，世界。'
    }
}
```

---

### 在core安裝語系

`oobe`不允許直接建立`locale`，必須藉由`addon`導入一組組件來進行擴展，試著把剛剛定義的語系加入組件。

```js
// 組件名稱不允許重複，須注意衝突問題。
oobe.addon({
    name: 'meg',
    locales
})
```

---

### 參數

`locale`輸出的`message`允許加入動態元素，使用`{value}`符號作為更動目標。

```js
let maxLocales = {
    'en-us': {
        'age': '{value} years old.'
    },
    'zh-tw': {
        'age': '年齡為{value}歲'
    }
}
```

---

### 在container建立私有語系

container可以針對每個sprite的名詞進行更細節的翻譯。

```js
let container = {
    locales: maxLocales
}
```

---

### 顯示訊息

```js
let sprite =  {
    body() {
        return {
            age: 0
        }
    }
}
container.sprites = { sprite }
oobe.join('demo', container)
let teen = oobe.make('demo', 'sprite').$born({ age: 18 })
console.log(sprite.$meg('#meg.hw')) // hello world.
console.log(sprite.$meg('age', sprite.age)) // 18 years old.
```

---

### 全局呼叫

跟`rule`相同，使用`addon`的語系需要使用前墜來顯示，但container底下的sprite宣告自己的私有語系是不需要前墜的。

事實上，所有的規則與語系都註冊在core內，因此在某些場合中，我們需要調用container的訊息時，可以使用`${containerName}.{key}`獲得訊息，範例如下：

```js
console.log(oobe.meg('$demo.age', 20)) // 20 years old.
```

---

### 切換語系

語系默認為`en-us`，可以使用以下方法更換顯示狀態。

```js
console.log(oobe.meg('$demo.age', 20)) // 20 years old.
oobe.setLocale('zh-tw')
console.log(oobe.meg('$demo.age', 20)) // 年齡為20歲.
oobe.setLocale('zh-cn')
console.log(oobe.meg('$demo.age', 20)) // $demo.age 未定義情境下，會顯示key值
```

---

該開始了嗎？別急，再來認識[Helper](./helper.md)吧。
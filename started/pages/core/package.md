## Package

* 規則 - [Rule](#rule)
* 語系 - [Locale](#locale)
* 官方配件包 - [OB](#ob)

---

### Rule

規則是一連串的驗證方法，試著將值傳給一個`function`，並回傳`true`或是錯誤訊息。

> 不建議使用箭頭函數，所有驗證方法皆會將`this`指向給呼叫驗證的`sprite`。

```js
function number(value) {
    let type = this.$helper.getType(value)
    return type === 'number' ? true : 'Value not a number'
})
```

#### 參數

Rule可以接受簡單的參數來賦予更靈活的宣告方法，在宣告指定對象後，接著輸入 `|` 切割參數，使用 `:` 定義值，例如`max|value:20`，獲取的對象將傳遞給第二個參數。

```js
function max(value, params) {
    if (params.value && value > Number(params.value)) {
        return `Value more then ${params.value}.`
    }
    return true
}
```

#### 在Container建立私有Rule

並不是所有的驗證方法都能滿足所有狀況，[Container](./container.md)可以自定義一組規則，這次我們可以把`max`加進Container中。

```js
let container = {
    rules: {
        max
    }
}
```

#### 所有的方法都會忽略空值

空值不做驗證，可以用以下方法使空值也做檢查。

> 空值的定義可以參考[helper.isEmpty](../tools/helper.md#isempty)

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


#### 在Core安裝Rule

`oobe`不允許直接建立一則`rule`，必須藉由`addon`導入一組組件來進行擴展，試著把剛剛定義的`number`驗證加入組件。

> 使用`addon`加入的規則皆需要遵照以下方法`#{name}.{key}`

```js
oobe.addon({
    name: 'pk',
    rules: {
        number
    }
})
```

#### 開始驗證

所有的驗證對象都是[Sprite](../sprite/structure.md)，因此仍要建立一個精靈。

> 在同一個[Container](./container.md)下，所屬的私有方法可以省略前墜。

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

由上方例子可得知`age`這個屬性需要是`number`，且最大值無法超過20，接下來開始正式驗證：

```js
container.sprites = { sprite }
oobe.join('demo', container)
let teen = oobe.make('demo', 'sprite').$born({ age: 18 })
let old = oobe.make('demo', 'sprite').$born({ age: 88 })
console.log(teen.$validate().success) // true
console.log(old.$validate().success) // false
```

---

### Locale

`oobe`提供了基礎的語系系統。

#### 在Core安裝語系

`oobe`不允許直接建立`locale`，必須藉由`addon`來進行擴展，試著把剛剛定義的語系加入組件。

```js
// 組件名稱不允許重複，須注意衝突問題。
oobe.addon({
    name: 'meg',
    locales: {
        'en-us': {
            'hw': 'hello world.'
        },
        'zh-tw': {
            'hw': '你好，世界。'
        }
    }
})
```

#### 參數

`locale`輸出的`message`允許加入動態元素，使用`{}`符號作為更動目標。

```js
let locales = {
    'en-us': {
        'age': '{value} years old.'
    },
    'zh-tw': {
        'age': '年齡為{value}歲'
    }
}
```

#### 在container建立私有語系

[Container](./container.md)可以針對每個[Sprite](../sprite/structure.md)的名詞進行更細節的翻譯。

```js
let container = {
    locales: {
        'en-us': {
            'age': '{value} years old.'
        },
        'zh-tw': {
            'age': '年齡為{value}歲'
        }
    }
}
```

#### 顯示訊息

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
console.log(sprite.$meg('age', {
    value: sprite.age
})) // 18 years old.
```

#### 全局呼叫

跟`rule`相同，使用`addon`的語系需要使用前墜來顯示，但[Container](./container.md)底下的[Sprite](../sprite/structure.md)宣告自己的私有語系是不需要前墜的。

事實上，所有的規則與語系都註冊在[Core](./oobe.md)內，因此在某些場合中，我們需要調用Container的訊息時，可以使用`${containerName}.{key}`獲得訊息，範例如下：

```js
console.log(oobe.meg('$demo.age', { value: 20 })) // 20 years old.
```

#### 切換語系

語系默認為`en-us`，可以使用以下方法更換顯示狀態。

```js
console.log(oobe.meg('$demo.age', { value: 20 })) // 20 years old.
oobe.setLocale('zh-tw')
console.log(oobe.meg('$demo.age', { value: 20 })) // 年齡為20歲.
oobe.setLocale('zh-cn')
console.log(oobe.meg('$demo.age', { value: 20 })) // $demo.age 未定義情境下，會顯示key值
```

---

### OB

`ob`是一個官方配件包，你可以參考ob的[原始碼](https://github.com/SoftChef/oobe/blob/master/packages/ob.js)來了解應用。

#### ob

`ob`攜帶了我們常用的驗證方法並提供了`en-us`與`zh-tw`兩個語系。

```js
import ob from 'oobe/packages/ob'
oobe.addon(ob)
```

#### 擴充語系

`ob`只是提供一個物件，可以藉由下列方法擴充語系：

```js
ob.locales['ja'] = {
    'key': '免っがわ來じっ套'
}
```

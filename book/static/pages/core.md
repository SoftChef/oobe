# oobe document

[Core](#core)

[Rule](#Rule)

[Container](#container)

[Sprite](#sprite)

[Helper](#helper)

# Rule

Rule是一個驗證方法，回傳`true`是通過，回傳`string`則失敗。

## 方法

```js
function max(value, params) {
    return value <= Number(params.target) ? true : `Value over ${params.target}`
})
```

## 參數

使用 `|` 切割參數，使用 `:` 定義值。

```js
validate(['isString|target:20'])
```

## Core Rules

私有Rule以 `$` 字號作為前墜，請避免命名衝突。

# Core

```js
let core = new oobe()
```

## APIS

[addRule](###addRule(name,&nbsp;rule))

[getRules](###getRules(target))

[validate](###validate(ruleName,&nbsp;value))

[addContainer](###addContainer(name,&nbsp;containerData,&nbsp;options))

[make](###make(containerName,&nbsp;spriteName,&nbsp;rawData))

---

### addRule(name, rule)

全局註冊一個驗證方法。

* name : required => string
* rule : required => function

```js
core.addRule('string', (value, params) => {
    let type = typeof value
    return type === 'string' ? true : 'Param not a string.'
})
```

---

### getRules(target)

獲取一個驗證列表。

* target : required => array
    - array可以是個`rule` function，他會原封不動被加入參數中。
* reutrn : `array` => [function, ...]

```js
let fn = value => true
let rules = core.getRules(['string', 'max|target:20', fn])
console.log(rules) // [function, function]
```

---

### validate(value, targetRules)

* value : required => any
* targetRules : required => array => [string or rule function]
* return : `true` or `string`

對一個參數多重驗證。

```js
let result = core.validates('', ['string', '@require'])
console.log(result) // require
```

---

### addContainer(name, containerData, options)

加入一個`container`，並獲取 `container` 於 `install` 回傳的值。

* name : required => string
* containerData : required => any
* options : optional => object
* return : `any`

---

### make(containerName, spriteName, rawData)

* containerName : required => string
* spriteName : required => string
* rawData : required => any
* return : `sprite`

建立一個 `sprite`。

# Container

## Options

```js
const moment = require('moment')
core.addContainer('myFirstContainer', {
    sprites: {
        myFirstSprite: spriteOptions,
        anotherSprite: anotherSprite
    },
    install(confings, options) {},
    rules: {
        number: v => typeof value === 'number' ? true : 'Value not a number.'
    },
    utils: {
        moment
    },
    configs: {
        foo: 'foo'
    },
    methods: {
        foo() {
            return this.$configs.foo
        }
    },
    states: [
        'frozen'
    ]
})
```

### sprites

* required
* object

Container所有的精靈。

### install(configs, options)

* optional
* function

加入Core的初始化行為，作為core交換資料的接口。

### rules

* optional
* object

私有驗證方法。

### methods

* optional
* object

通用方法，所有的精靈都會繼承這些方法。

### utils

* optional
* object

跟`methods`一樣，但不會導向`this`至`sprite`，適用於模組擴充。

### configs

* optional
* object

底下的`sprite`能接收到的通用設定值。

### states

* optional
* array

每個`sprite`都有CRUD四個`state`，可以用`states`可以擴充私有型態。

---

# Sprite

所有的系統方法與屬性都會以`$`作為前墜符號。

## Options

```js
let sprite = {
    body() {
        return {
            count: 0
        }
    },

    refs: {
        anotherSprite: 'anotherSprite'
    },

    rules: {
        count: ['$number']
    },

    reborn(rawData) {
        return rawData
    },

    create() {},

    origin() {
        return this.$body()
    },

    methods: {
        add() {
            this.count += 1
        }
    },

    states: {
        read: {
            fixed: '*',
            export() {
                return {}
            }
        },
        create: {},
        update: {},
        delete: {}
    }
}
```

### body

* required
* object

定義 `sprite` 的基本參數，以下所有行為接對應 `body` 回傳的 `key` 值。

### refs

* optional
* object

建議每個 `sprite` 都支援一層data，對於第二層或者是關聯出來的屬性都使用refs做為另一個 `sprite` 實例。

### rules

* optional
* object

定義所有的 `body` 的驗證行為，使用 `$` 字號會把驗證導向私有驗證。

### reborn

* optional
* function

將raw data轉換成body的過程。

預設的方法 :

```js
function reborn(rawData) {
    return rawData
}
```

### create

* optional
* function

初次建立時，綁定 `reborn` 後呼叫，可作為驗證層。

### origin

* optional
* function

將body轉換成raw data的過程。

預設的方法 :

```js
function origin() {
    return this.$body()
}
```

### methods

* optional
* object

一個該 `sprite` 的私有方法。

### states

* optional
* object
    * fixed
        * optional
        * array || string
        該狀態不可修正的值，宣告為 `*` 則全部都不能改。
    * export
        * optional
        * function
        該狀態輸出的值。

狀態的變化改變的內部屬性設定。

## Properties

### core

make的core。

### fn

methods的層載物件。

```js
// self methods
sprite.$fn.add()
console.log(sprite.count) // 1
// container methods
let foo = sprite.$fn.foo()
console.log(foo) // foo
```

### utils

從`container`獲取的工具組。

```js
console.log(sprite.$utils.moment()) // moment
```

### helper

由`oobe`自身提供的常用方法。

```js
let foo = sprite.$helper.deepClone({
    foo: 'bar'
})
console.log(foo) // 'bar'
```


## APIS

```js
let sprite = oobe.make('myFirstContainer', 'myFirstSprite', rawData)
console.log(sprite.count) // 0
```

### out() and revive()

* return : sprite

抽離一份具相同資料的`sprite`並保綁定雙向關係，被綁定的`sprite`會宣告死亡，而被抽離出來的`sprite`稱為`soul`。

`soul`具有`revive`方法，可以喚醒被綁定的`sprite`並將自身的資料傳遞過去，之後宣告自己死亡。

```js
let soul = sprite.$out()
console.log(sprite.count) // 1
console.log(soul.count) // 1

sprite.$fn.add() // throw error 'This Sprite is dead'
soul.$fn.add()

console.log(sprite.count) // 1
console.log(soul.count) // 2

soul.$revive()

console.log(sprite.count) // 2
console.log(soul.count) // 2

sprite.$fn.add()
soul.$fn.add() // throw error 'This Sprite is dead'
```

### dead()

* return : sprite

也是只有`soul`可以宣告，宣告後喚醒綁定的`sprite`並死亡，但不會將資料回傳給綁定對象。

```js
sprite.count = 1
let soul = sprite.$out()
console.log(sprite.count) // 1
console.log(soul.count) // 1

soul.$fn.add()
soul.$dead()

console.log(sprite.count) // 1
```

### copy()

* return : sprite

直接從現有狀態複製一份`sprite`，不會有任何綁定狀態。

```js
let new_sprite = sprite.$copy()
```

### body()

* return : object

獲取`body`的現有資料。

```js
let body = sprite.$body()
console.log(body.count)
```

### raws()

* return : object
    * default: object => 初始資料
    * rawBody: string => 最初始化狀態的body json
    * rawData: string => 最初始化狀態的data json

會傳出使狀態資料。

### meg(key, value)

* key : required => string
* value : optional => object
* return : string

### keys()

* return : array => [string, ...]

獲取`body`和`refs`所有的`key`。

```js
let keys = sprite.$keys()
console.log(key) // ['count', 'anotherSprite']
```

### reset()

將資料重製回最初的模樣。

### rules(name, extra)

* name : required => string
* extra : optional => array => [string or rule function]
* return : array => [function, ...]

獲取指定rule的驗證方法集。

```js
let rules = sprite.$rules(['$number', '@require'])
```

### status()

* return : object
    * live: boolean => 是否活著
    * fixed: array => 現階段狀態的鎖定名單
    * state: string => 現階段狀態的名稱

回傳現有狀態。

### export()

* return : any

依照現階段的狀態輸出值。

### configs()

獲取`container`的`config`。

### isFixed(key)

* key : required => string
* return : boolean

該`property`是否為固定狀態(並非真的無法修改)。

### isHidden(key)

* key : required => string
* return : boolean

該`property`是否為隱藏狀態(並非真的無法顯示)。

### toOrigin()

* return : any

獲取origin行為回傳的資料。

### isChange()

* return : boolean

屬性是否被更動過。

### validate()

* return : object
    * success : boolean
    * errors : array => [string, ...]

所有的`body`和`refs`藉由宣告的rules驗證的結果。

### distortion(stateName)

* stateName : required => string
* return : self sprite

轉換指定狀態，若要擴充狀態必須在`container`的`states`中宣告。

# state

## Options

### fixed

* optional
* array => [string, ...]

只是個狀態變動，不會有任何實際表現行為。

### hidden

* optional
* array => [string, ...]

只是個狀態變動，不會有任何實際表現行為。

### export

* optional
* function

`sprite`輸出的模式。

預設狀態為下 :

```js
function export() {
    return this.$toOrigin()
}
```

# Helper

## APIS

### deepClone(target)

* target : required : any

深拷貝一個對象。

### mapping(data, forward, map)

* data : required : object
* forward : required : boolean
* map : required : object

將值轉換對應Key。

```js
let data = {
    name: 'admin'
}
let result = this.user.$helper.mapping(data, true, {
    name: 'username'
})
console.log(result.username) // admin
```

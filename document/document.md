# oobe document

[Core](#core)

[Container](#container)

[Sprite](#sprite)

# Core

```js
let core = new oobe()
```

## Rule

Rule是一個驗證方法，回傳`true`是通過，回傳`string`則失敗。

#### 語法

```js
function max(value, params) {
    return value <= Number(params.target) ? true : `Value over ${params.target}`
})
```

#### 參數

使用 `|` 切割參數，使用 `:` 定義值。

```js
validate(['isString|target:20'])
```

#### Core Rule

Core的Rule具有前墜符號 `@` ，而私有Rule則為 `$` 字號，請避免命名衝突。

> Core Rule 所有的錯誤訊息都會回傳他的名子，例如`@require`回傳`require`。

##### @ require

空陣列、空物件、空字串、null、undefined都算失敗。

## Apis

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

### getRules(target)

獲取一個驗證列表。

* target : required => array
    - array可以是個 `rule` function，他會原封不動被加入參數中。

```js
let fn = value => true
let rules = core.getRules(['string', 'max|target:20', fn])
console.log(rules) // [function, function]
```

### validate(ruleName, value)

* ruleName : required => string
* value : required => any

驗證一個方法。

```js
let vString = core.validate('string', '')
let vNumber = core.validate('string', 0)
console.log(vString) // true
console.log(vNumber) // Param not a string.
```

### validates(value, targetRules)

對一個參數多重驗證。

```js
let result = core.validates('', ['string', '@require'])
console.log(result) // require
```

### addContainer(name, containerData, options)

加入一個`container`，並獲取 `container` 於 `install` 回傳的值。

* name : required => string
* containerData : required => any
* options : optional => object

### getConfigs(name)

* name : required => string

獲取指定 `container` 的設定值。

### make(containerName, spriteName, rawData)

* containerName : required => string
* spriteName : required => string
* rawData : required => any

建立一個 `sprite`。

---

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

底下的 `sprite` 能接收到的通用設定值。

### states

* optional
* array

每個`sprite`都有CRUD四個`state`，可以用`states`可以擴充私有型態。

---

# Sprite

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
        read: {},
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

* required
* function

將raw data轉換成body的過程。

### create

* optional
* function

初次建立時，綁定 `reborn` 後呼叫，可作為驗證層。

### origin

* required
* function

將body轉換成raw data的過程。

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

## Apis

```js
let sprite = oobe.make('myFirstContainer', 'myFirstSprite', rawData)
console.log(sprite.count) // 0
```

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

### out()
### dead()
### copy()
### body()
### keys()
### reset()
### rules()
### utils()
### helper()
### revive()
### export()
### status()
### configs()
### isFixed()
### toOrigin()
### isChange()
### validate()
### distortion()
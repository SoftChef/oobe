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
core.addContainer('myFirstContainer', {
    sprites: {
        myFirstSprite: spriteOptions
    }
})
```

### sprites

* required
* object

Container所有的精靈。

### install(configs, options)

* optional
* function

加入Core的初始化行為。
<!-- rules: [false, ['object'], {}],
utils: [false, ['object'], {}],
sprites: [true, ['object']],
configs: [false, ['object'], {}],
methods: [false, ['object'], {}],
distortions: [false, ['object'], []] -->


    utils: {},

    configs: {},

    methods: {},

    distortions: [],

    rules: {}

### sprites

### install

### utils

### configs

### methods

### distortions

### rules

---

# Sprite

## Options

### body

### refs

### rules

### reborn

### origin

### methods

### distortion

## Apis

### fn
### out
### dead
### copy
### body
### keys
### reset
### rules
### utils
### helper
### revive
### export
### status
### configs
### isFixed
### toOrigin
### isChange
### validate
### distortion
# Core

`oobe`的運行需要一個`core`核心，其他組件都以註冊方式進行擴充，除了`container`外，`core`還擔任註冊`rule`與`locale`的責任。

關於`rule`與`locale`的實際機制，前往[package](./package.md)。

```js
let oobe = new Oobe()
```

## APIs

### join(name, container, options)

加入一組`container`並執行`container`的`install`行為。

* params
  * `name` {string} required
  * `container` {object} required
  * `options` {any} optional
* `return` {any}

```js
let container = {
    sprites: {},
    install(config, options) {
        return config.call + '' + options.target
    },
    configs: {
        call: 'hello'
    }
}
let result = oobe.join('demo', container, { target: 'world' })
console.log(result) // hello world
```

---

### addon(package)

core無法單方面加入`rule`與`locale`，必須要藉由`package`的方式註冊。

> 所有藉由addon註冊的事件都以 `#{name}.{target}` 組成 key 。

* params
    * `package` {object} required

```js
let pk = {
    name: 'sc',
    rules: {
        isNull(value) {
            return value == null ? true : 'not null'
        }
    }
}
oobe.addon(pk)
// 實際上core不開放直接validate的方法，這只是範例所需。
let sprite = oobe._core.systemSprite
let vaildate = oobe._core.rule.validate
console.log(validate(sprite, null, ['#sc.isNull'])) // true
```

---

### meg(name, value)

輸出一個語系訊息，可以藉由{}符號產生動態語法。

* params
    * `name` {string} required
    * `value` {object} optional
* `return` {string}

```js
let pk = {
    name: 'sc',
    locales: {
        'en-us': {
            'hello': 'hello {value}'
        }
    }
}
oobe.addon(pk)
let meg = oobe.meg('#sc.hello', {
    value: 'world'
})
console.log(meg) // hello world
```

雖然`container`內部驗證可以省去前墜，但本質也是向`core`做註冊，以`${containerName}.{target}`組成key，意味著我們可以從`core`獲取訊息。

```js
let container = {
    sprites: {},
    locales: {
        'en-us': {
            hw: 'hello world.'
        }
    }
}
oobe.join('demo', container)
console.log(oobe.meg('$demo.hw')) // hello world
```

---

### setLocale(locale)

設定當下語系。

> `en-us`是預設語系。

* params
    * `locale` {string} required

```js
let container = {
    sprites: {},
    locales: {
        'zh-tw': {
            hw: '你好世界'
        },
        'en-us': {
            hw: 'hello world'
        }
    }
}
oobe.join('demo', container)
console.log(oobe.meg('$demo.hw')) // hello world
oobe.setLocale('zh-tw')
console.log(oobe.meg('$demo.hw')) // 你好世界
```

---

### getRules(items)

獲取一組規則。

> items不一定是一組字串，也可以傳遞一組function，系統會協助綁住this至sprite上。

* params
    * `items` {array} required
* `return` {array}

```js
let pk = {
    name: 'sc',
    rules: {
        isNull(value) {
            return value == null ? true : 'not null'
        }
    }
}
oobe.addon(pk)
let number = function(value) {
    return typeof value === 'number' ? true : 'not a number'
}
let rules = oobe.getRules(['#sc.isNull', number])
console.log(rules) // [function, function]
```

---

### make(containerName, spriteName)

建立一組由sprite實例的model。

* params
    * `containerName` {string} required
    * `spriteName` {string} required
* `return` {sprite} => [sprite](./sprite.md)

```js
let container = {
    sprites: {
        foo: {
            body() {
                return {
                    name: ''
                }
            }
        }
    }
}
oobe.join('demo', container)
let model = oobe.make('demo', 'foo').$born({
    name: 'bar'
})
console.log(model.name) // bar
```

# Container

`container`是一個組(Group)，意味著它可以定義通用資料於同群組`sprite`中，包括在規則與語系共享。

  * 精靈群組：[Sprites](#sprites)
  * 規則群組：[Rules](#rules)
  * 語系群組：[Locales](#locales)
  * 設定參數：[Configs](#configs)
  * 擴增狀態：[Dists](#dists)
  * 資料交換：[Install](#install)
  * 通用方法：[Methods](#methods)、[Collection Methods](#collection-methods)
  * 擴展工具：[Utils](#utils)
  * 規範介面：[Interface](#interface)

---

### Sprites

[Sprite](../sprite/structure.md)的集合。

> Sprites是必要的參數。

```js
// 建立sprite
let sprite = {
    body() {
        return {
            a: ''
        }
    }
}
// 建立container
let container = {
    sprites: {
        sprite
    }
}
// 註冊進core
oobe.join('container', container)
let mySprite = oobe.make('container', 'sprite')
```

---

### Rules

參數驗證方法，詳細方法可見[Rule](./package.md#rule)。

> 在同一個Container內的[Sprite](../sprite/structure.md)可以共享驗證規則。

```js
let container = {
    // ...
    rules: {
        string(value) {
            return typeof value === 'string' ? true : 'Not a string.'
        }
    }
    // ...
}
let sprite = {
    body() {
        return {
            name: ''
        }
    },
    rules: {
        name: ['string']
    }
}
// ...
let user = oobe.make('container', 'sprite').$born({ name: 'steve' })
console.log(user.$validate().success) // true
```

---

### Locales

[Sprite](../sprite/structure.md)可以共享的語系群組，詳細方法可見[Locale](./package.md#locale)。

> [Sprite](../sprite/structure.md)無法自行定義Locale。

```js
let container = {
    // ...
    locales: {
        'en-us': {
            'hw': 'hello world.'
        },
        'zh-tw': {
            'hw': '你好，世界。'
        }
    }
    // ...
}
// ...
sprite.$meg('hw') // 'hello world.'
```

---

### Configs

協助定義一些開發環境或者是固定的資料，例如公司統編。

```js
let container = {
    // ...
    sprites: { mySprite },
    configs: {
        vatNumber: '12345678'
    }
    // ...
}
console.log(sprite.$configs.vatNumber) // 12345678
```

---

### Dists

一般的[Sprite](../sprite/structure.md)只能定義`read`、`create`、`update`、`delete`四個狀態，該屬性允許擴增定義的。

```js
let container = {
    // ...
    dists: ['newDist']
    // ...
}
let sprtie = {
    dists: {
        newDist: { ... }
    }
}
```

---

#### Install

`install`這個週期會在引入[`oobe`](./oobe.md)時觸發，並協助交換`configs`。

```js
let container = {
    // ...
    configs: {
        vatNumber: ''
    },
    install(configs, options) {
        configs.vatNumber = options.vatNumber
        return 'success'
    }
    // ...
}
let result = oobe.join('container', container, {
    vatNumber: '12345678'
})
console.log(result) // 'success'
// ...
console.log(sprite.$configs.vatNumber) // 12345678
```

---

### Methods

在Container定義的方法會在建立Sprite時轉移過去，若Sprite定義了相同的方法，則Sprite優先。

```js
let container = {
    // ...
    configs: {
        vatNumber: '12345678'
    },
    methods: {
        getVatNumber() {
            // this指向實例化的精靈
            return this.$configs.getVatNumber
        }
    }
    // ...
}
// ...
sprite.$fn.getVatNumber() // 12345678
```

---

### Collection Methods

如同[Methods](#methods)的[Collection](../collection/structure.md#methods)版本。

```js
let container = {
    // ...
    configs: {
        vatNumber: '12345678'
    },
    collectionMethods: {
        getVatNumber() {
            // this指向實例化的精靈
            return this.$configs.getVatNumber
        }
    }
    // ...
}
// ...
collection.methods.getVatNumber() // 12345678
```

---

### Utils

`Utils`是一個擴展外掛接口，與[Method](#methods)不同的點在於它並不會強制將`this`導向`sprite`或`collection`，另一個目的是我們並不鼓勵把套件從精靈引入，這樣會使的開發人員有機會的錯過某項依賴套件。

```js
// 在 container 宣告引用moment可以幫助開發人員了解依賴套件。
import moment from 'moment'
let container = {
    // ...
    utils: { moment }
    // ...
}

console.log(sprite.$utils.moment) // moment module
```

---

### Interface

Interface可以規範[Sprite](../sprite/structure.md)必須實作某些方法，如果不符規則會擲出錯誤。

```js
let interface = {
    views: ['name'],
    dists: ['update'],
    methods: ['rename']
}
let sprite = {
    body() {
        return {
            name
        }
    },
    dists: {
        update: {}
    },
    methods: {
        rename() {}
    }
}
let container = {
    sprites: { sprtie },
    interface
}
oobe.join('interface', container) // (☉д⊙)!! Oobe::Container => initSprites -> Interface error for : views[name]
```

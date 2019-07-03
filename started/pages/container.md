# Container

`container`是`Out-of-Box Experience`的精隨，由`container`封裝的精靈組可以在任何的oobe專案內游離，包刮後端。

延續上一節的Staff精靈，接下來將更正規化整個架構，首先我們先建立`company`這個`container`，並告知它有`staff`與`unit`兩種精靈可以建立。

```js
let company = {
    sprites: { staff, unit }
}
```

## 與Sprite互動

`container`是一個組(Group)，意味著它可以定義通用資料於同群組`sprite`中，包括在[rule&locale](./rule_and_locale.md)章節中提到的規則與語系共享。

### 設定 - Config

`Config`協助我們定義一些開發環境或者是固定的資料，例如公司統編。

```js
let company = {
    sprites: { staff, unit },
    configs: {
        vat_number: '94879487'
    }
}
console.log(dave.$configs.vat_number) // 94879487
```

#### 資料交換 - Install

但是這個模型可能會套用在眾多公司的系統上，統編就不能寫死，`install`這個週期會在引入core時觸發，並協助交換`configs`。

```js
let company = {
    sprites: { staff, unit },
    configs: {
        vat_number: ''
    },
    install(configs, options) {
        configs.vat_number = options.vat_number
        return 'success'
    }
}
let result = oobe.join('company', company, {
    vat_number: '54875487'
})
console.log(result) // 'success'
console.log(dave.$configs.vat_number) // 54875487
```

### 通用方法 - Method

在`container`定義的方法會在建立`sprite`時轉移過去，若`sprite`定義了相同的方法，則`sprite`優先。

```js
let company = {
    sprites: { staff, unit },
    methods: {
        bodyToPrettyJSON() {
            return JSON.stringify(this.$body(), null, 4)
        }
    }
}
console.log(dave.$fn.bodyToPrettyJSON())
/* 
{
    "name": "Dave"
}
*/
```

### 工具組 - Util

`Util`是一個擴展外掛接口，與method不同的點在於它並不會強制將`this`導向`sprite`，另一個目的是我們並不鼓勵把套件從精靈引入，這樣會使的開發人員有機會的錯過某項依賴套件。

```js
// 在 container 宣告引用moment可以幫助開發人員了解依賴套件。
import moment from 'moment'
let company = {
    sprites: { staff, unit },
    utils: { moment }
}
console.log(dave.$utils.moment) // print moment module
```

## 狀態 - States

除了系統建構的CRUD state之外，隨意呼叫任何的`distortion`都會擲出錯誤，若需要擴展更多的狀態，必須在`container`中宣告。

```js
let company = {
    sprites: { staff, unit },
    states: ['adminUpdate']
}
dave.$distortion('adminUpdate') // success
```

## 規範介面 - Interface

Interface可以規範Sprite必須實作某些方法。

```js
let interface = {
    views: ['name'],
    states: ['update'],
    methods: ['rename']
}
let sprite = {
    body() {
        return {
            name
        }
    },
    states: {
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

## 總結

以下開始技術總結：

```js
import moment from 'moment'
let company = {
    sprites: { staff, unit },
    configs: {
        vat_number: ''
    },
    install(configs, options) {
        configs.vat_number = options.vat_number
        return 'success'
    },
    methods: {
        bodyToPrettyJSON() {
            return JSON.stringify(this.$body(), null, 4)
        }
    },
    utils: { moment },
    states: ['adminUpdate']
}
```

定義完`container`後教學就可以算是結束了，了解`container`的分離結構是oobe最重要的課題，未來會更強化這部分。

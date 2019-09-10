<br>

<p align="center"><img src="https://softchef.github.io/oobe/assets/logo.png"></p>

<p align="center">
oobe is javascript view model library, focus data, event, collection and validate method.
</p>

<p align="center">

<a href="https://npmjs.org/package/oobe">
    <img src="https://img.shields.io/npm/v/oobe.svg" alt="Chat on Gitter"  style="max-width:100%;">
</a>

<a href="https://travis-ci.org/SoftChef/oobe">
    <img src="https://travis-ci.org/SoftChef/oobe.svg?branch=master" alt="Coverage Status"  style="max-width:100%;">
</a>

<a href="https://coveralls.io/github/SoftChef/oobe?branch=master">
    <img src="https://coveralls.io/repos/github/SoftChef/oobe/badge.svg?branch=master" alt="Coverage Status"  style="max-width:100%;">
</a>

</p>

---

## 概念

oobe的概念是來自從vue表單組件中抽出model property時所建構的，當時的目的是為了讓update與create兩個表單能夠實例化同一組instance即可，但意外的是這樣的設計在我們遇到資料格式與狀態的轉換之間有極好的效果，因此決定編寫此library作為一個設計典範。

> 雖然oobe是為了vue環境編寫，但它並不是vuejs的套件。

### 起源於vue與vuex之間缺乏model

整體設計參照了backbone與vue-mc，前者自成一格難以引進vue開發，而後者太過強大，它甚至處理了vuex和axios的工作，而oobe是一個專注在model處理的系統。

vue-mc有發現component與store中間少了一層model，但vuex並沒有直接提供解決方案。

![vuex](https://softchef.github.io/oobe/assets/vuex.png)

### 最初instance的設計

通常我們會把後端回來的資料實例化一份instance而不是直接使用，以確保能夠將業務邏輯與用戶界面分開，設計如下：

```js
// User.js
class User {
    constructor(source = {}) {
        this.name = source.name || ''
        this.phoneNumber = source.phoneNumber || ''
    }
}
```

```html
<template>
    <div>
        <input v-model="user.name">
        <input v-model="user.phoneNumber">
    </div>
</template>
<script>
    import User from 'User.js'
    export default {
        data() {
            return {
                user: new User({
                    name: 'admin'
                })
            }
        }
    }
</script>
```

#### 用oobe建構

以下是用oobe達成一樣的效果：

```js
// profile.js
export default {
    body() {
        return {
            name: '',
            phoneNumber: ''
        }
    },
    born(source = {}) {
        // 如果source沒有body所定義的則body會採用預設值
        return source
    }
}
```

```js
// oobe.js
import Oobe from 'oobe'
import profile from './profile.js'
let oobe = new Oobe()
oobe.join('User' {
    sprites: { profile }
})
```

```html
<template>
    <div>
        <input v-model="user.name">
        <input v-model="user.phoneNumber">
    </div>
</template>
<script>
    import oobe from './oobe'
    export default {
        data() {
            return {
                user: oobe.make('User', 'profile').$born({
                    name: 'admin'
                })
            }
        }
    }
</script>
```

### 為你封裝好狀態與常用的功能

上面的方法會經過一個工廠將instance綁定常用的方法與事件：

#### 方法

```js
let user = oobe.make('User', 'profile').$born()
console.log(user.$isChange()) // false
user.name = 'test'
console.log(user.$isChange()) // true
```

#### 狀態

```js
let user = oobe.make('User', 'profile').$born()
console.log(user.$error) // undefined
user.$setError('error')
console.log(user.$error) // 'error'
```

#### 事件

```js
let user = oobe.make('User', 'profile')
user.$on('$ready', () => {
    console.log('ready')
})
user.$born() // 'ready'
```

#### 集合

```js
let users = oobe.collection('User', 'profile')
let items = []

items.push({
    user: 'admin'
})
items.push({
    user: 'guest'
})

users.batchWrite(items)
console.log(users.items[0].name) // admin
```

### Container 與 Sprite

這是來自資料庫關聯設計下決定的分類模式，例如下列兩張table：

#### users

| name          | phoneNumber   |
| ------------- | ------------- |
| admin         | +886928000000 |

#### user-metadatas

| name          | key           | value         |
| ------------- | ------------- | ------------- |
| admin         | age           | 25            |

#### result data

我們有兩種資料格式回來的可能：

```js
user = {
    name: 'admin',
    phoneNumber: '+886928000000',
    metadatas: {
        age: 25
    }
}

metadatas = {
    name: 'admin',
    age: 25
}
```

這是同一系列的模型但是兩隻不同的instance，因此我們決定將資料結構定義如下：

```js
let user = {
    body() {
        return {
            name: '',
            phoneNumber: ''
        }
    },
    refs: {
        metadatas: 'metadatas'
    }
}

let metadatas = {
    body() {
        return {
            age: null
        }
    },
    methods: {
        isAdult() {
            return this.age > 18
        }
    }
}

let container = {
    sprites: {
        user,
        metadatas
    }
}

let oobe = new Oobe()

oobe.join('User', container)

// 當我們收到的資料格式如下
let result = {
    name: 'admin',
    phoneNumber: '+886928000000',
    metadatas: {
        age: 25
    }
}

let sprite = oobe.make('User', 'user').$born(result)

console.log(sprite.metadatas.$fn.isAdult()) // true
```

### Nodejs

oobe與其他model最大的差異在於專注在視圖處理，我們為它內置了以下這簡易的模式，這也是雖然它可以運行在nodejs但不推薦的原因，我們希望它能夠依據資料來回決定呈現的樣子，這在後端的風險太大了。

![data](https://softchef.github.io/oobe/assets/data.png)

---

## 更深入了解oobe

oobe的目標是建構vue大型應用，我們建構了一系列說明與範例：

[Example](https://softchef.github.io/oobe/example/)

[Document](https://softchef.github.io/oobe/docs/)

[Getting started](https://softchef.github.io/oobe/started/)

---

## Installation

### Web

```html
<script src="./dist/index.js"></script>
<script>
    let oobe = new Oobe()
</script>
```

### Webpack

```bash
$npm i --save oobe
```

```js
import Oobe from 'oobe'
let oobe = new Oobe()
```

### Node
```bash
$npm i --save oobe
```

```js
let Oobe = require('oobe')
let oobe = new Oobe()
```

---

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| support| support| support| support| support| support


> 理論上能夠被IE11支持，但defaultView因為採用proxy所以會被忽略。

---

## Other

[medium](https://medium.com/sensor-live/oobe-javascript-view-model-library-a6ada8d56566)

[versions](https://softchef.github.io/oobe/version)

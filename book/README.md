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

<a href="https://standardjs.com/">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard Code Style"  style="max-width:100%;">
</a>

</p>

***

### Summary

`oobe`是一個front end view model library，具有最基本的structure定義、collection與資料格式驗證，但不僅僅是如此：

* 內建方法免除程式碼的重複編寫與煩雜的繼承樹
* 針對vue進行一系列的優化
* 針對ui設計的非同步載入模型
* 針對ui設計的自我狀態管理
* 統一前端格式的轉化模型

> 我們推薦oobe在vue上運行，且以下教學大多都會以vue作為例子。

---

### Install

#### Browser

```html
<script src="https://softchef.github.io/oobe/dist/index.js"></script>
```

```js
const oobe = new Oobe()
```

#### Webpack

```bash
npm i oobe --save
```

```js
import Oobe from 'oobe'
const oobe = new Oobe()
```

---

### Supports

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| support| support| support| support| support| support

---

### How To Use

以下是以vue專案建議的資料結構：

```bash
├── index.html
├── main.js
├── oobe
│   ├── index.js
│   ├── plugins
│   ├── packages
│   └── containers
│       └── user
│           ├── index.js # container
│           ├── profile.js # sprite
│           └── attributes.js # sprite
│ # vue
├── pages
│   └── user
│       └── create.vue
└── components
    └── form.vue
```

#### Architecture

`oobe`的結構關聯如下：

![architecture][architecture]

#### Invoke

定義Profile的結構：

```js
// oobe/containers/user/profile.js
export default {
    body() {
        return {
            name: ''
        }
    },
    refs: {
        attributes: 'attributes'
    }
}
```

定義User Container的結構：

```js
// oobe/containers/user/index.js
import profile from './profile'
import attributes from './attributes'

export default {
    sprites: {
        profile,
        attributes
    }
}
```

註冊並使用Sprite：

```js
// oobe/index.js
import Oobe from 'oobe'
import user from './containers/user'

let oobe = new Oobe()
    oobe.join('user', user)

let user = oobe.make('user', 'profile').$born({
    name: 'steve',
    age: 20
})

console.log(user.name) // steve
console.log(user.age) // undefined
```

[architecture]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAADdCAYAAAAb1G22AAAFRHRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMnd3dy5kcmF3LmlvJTIyJTIwbW9kaWZpZWQlM0QlMjIyMDIwLTAxLTMwVDAzJTNBMjAlM0EyOS4zNjNaJTIyJTIwYWdlbnQlM0QlMjJNb3ppbGxhJTJGNS4wJTIwKE1hY2ludG9zaCUzQiUyMEludGVsJTIwTWFjJTIwT1MlMjBYJTIwMTBfMTRfNiklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkY3OC4wLjM5MDQuODclMjBTYWZhcmklMkY1MzcuMzYlMjIlMjBldGFnJTNEJTIyY2pZSDB3b185aUxWUnM5QkxoQm8lMjIlMjB2ZXJzaW9uJTNEJTIyMTIuNi4xJTIyJTIwdHlwZSUzRCUyMmRldmljZSUyMiUzRSUzQ2RpYWdyYW0lMjBpZCUzRCUyMlBfejdCZGxPSFNPVHlUYkYxejNSJTIyJTIwbmFtZSUzRCUyMlBhZ2UtMSUyMiUzRTdWbkxqcHN3RlAwYWxsTUZIUEpZZGpLWlB0U3FsYkxvWkduQkhiQUtHRGxtQXZQMU5iWE55MG1UUnBrQktXd1E5JTJGaUJmWHdPMkJjTHJlTDhFOE5wJTJCSjM2RUZuT3hNOHQ5R0E1emhJNTRsb0NoUVRjQlpKQXdJZ3ZJYnNHTnVRVkZEaFJhRVo4MkxVcWNrb2pUdEkyNk5Fa0FZJTJCM01Nd1kzYmVyUGRPbyUyRmRRVUIyQUFHdzlISnZxTCUyQkR5VTZNS1oxJTJGaG5JRUdvbjJ6UGxySWt4cnF5bXNrdXhEN2ROeUMwdHRDS1VjcmxYWnl2SUNxNTA3eklkbzlIU3F1Qk1VajRPUTN1NE1lWDElMkZWeiUyRkRYY2hrWDZqV3p1bjFaM3FwY1hIR1Zxd2g1bG9BYk1DODBDbzFuaVE5blJ4RUwzJTJCNUJ3MktUWUswdjNZdGtGRnZJNEVwRXRibFdYd0Rqa1I4ZHFWd3dJNVFDTmdiTkNWRkVOa0NaTnFXYXF3bjI5QkxhdUVqYm9ueWtNcTFVUHFwNXJZc1NONHVZJTJGZUhJTzhKUndUQkpn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
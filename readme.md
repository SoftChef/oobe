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

## Introduction

When business logic and user interface are entangled, change is hard; when logic doesn't depend on UI, your interface becomes easier to work with. *--backbone.js*

Our goal is to build a vue library that focuses on model processing, Not like backbone.js and vue-mc that overly powerful library.

![data](https://softchef.github.io/oobe/assets/data.png)

> Although oobe is written for the vue.js, but only for optimized not a vue.js plugin, it can run include nodejs anywhere.

---

## Javascript Class Instance Pattern

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

---

## Use oobe

We can use oobe make same effect:

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
        // If source haven't body definition the key, use default.
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

---

## Sprite Not A Normal Instance

Make will create instance via object factory bind some method and status, no need for complex inheritance trees to get these capabilities, this product object we call then `sprite`.

#### System metohds

```js
let user = oobe.make('User', 'profile').$born()
console.log(user.$isChange()) // false
user.name = 'test'
console.log(user.$isChange()) // true
```

#### Status

```js
let user = oobe.make('User', 'profile').$born()
console.log(user.$error) // undefined
user.$setError('error')
console.log(user.$error) // 'error'
```

#### Event

```js
let user = oobe.make('User', 'profile')
user.$on('$ready', () => {
    console.log('ready')
})
user.$born() // 'ready'
```

#### Collection

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

### For Ajax

No like us often use new keyword, sprite complete construction need call $born(), because ajax have null, success, error three status, we can control to change with the current state.

```js
let sprtie = oobe.make('User', 'profile')
axios
    .get('./user')
    .then(result => sprite.$born(data))
    .catch(error => sprite.$setError(error))
```

### Container Amd Sprite

This is the classification pattern determined from the database association design, such as the following two tables:

#### users

| name          | phoneNumber   |
| ------------- | ------------- |
| admin         | +886928000000 |

#### user-metadatas

| name          | key           | value         |
| ------------- | ------------- | ------------- |
| admin         | age           | 25            |

#### Result data

Server side echo maybe the following two format:

##### User

```json
{
    "name": "admin",
    "phoneNumber": "+886928000000",
    "metadatas": {
        "age": 25
    }
}
```

##### Metadata

```json
{
    "name": "admin",
    "age": 25
}
```

This is same series just bifurcation to two instance, therefore we decide following data structure:

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

// If api result data like this:
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

---

## Learn More

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

> In theory, it can be supported by IE11, but the defaultView will be ignored it is adopted.

---

## Other

[medium](https://medium.com/sensor-live/oobe-javascript-view-model-library-a6ada8d56566)

[versions](https://softchef.github.io/oobe/version)

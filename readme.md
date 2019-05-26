# oobe

[![NPM Version][npm-image]][npm-url]

oobe目的為原始資料與控制器之間的中介者，具有資料轉換與驗證方法。

他將為你帶來：

* 降低前後端的耦合。
* 模組化提高通用性。
* 為表單操作帶來良好的開發體驗。
* 驗證、狀態等模式提高操作安全。
* 具有model的特性，可統一 js 與 nodejs 前後端的組件運作。

![Like Sprite][LinkSpriteImg]

---

## Installation

### Web

```html
<script src="./dist/index.js"></script>
<script>
    let core = new oobe()
</script>
```

### Webpack

```bash
$npm i --save oobe
```

```js
import oobe from 'oobe'
let core = new oobe()
```

### Node
```bash
$npm i --save oobe
```

```js
let oobe = require('oobe')
let core = new oobe()
```

---

## Introduction

下列是我們建立 mvvm 時的工作模式，由於 ViewModel 層容易出現 View 不同但資料來源相同的情況，導致組件複用性不構，且耦合過大導致維護困難。

<br>
<div style="text-align: center">
    <img src="https://softchef.github.io/oobe/assets/oobe1.png">
</div>
<br>

`oobe`將部分相同的 Model 與 View Controller 抽離，並為具有與資料層溝通的接口。

<br>
<div style="text-align: center">
    <img src="https://softchef.github.io/oobe/assets/oobe2.png">
</div>
<br>

---

## How to use

### First Sprite

精靈(sprite)是`oobe`的最小對象，也是我們定義一切所產生的最終物件。

> 以下範例是最小化實例`sprite`的需求，更好的利用`oobe`請參閱 [examples](https://github.com/SoftChef/oobe/tree/master/examples/)。

```js
let oobe = require('oobe')
let core = new oobe()
let sptire = {
    body() {
        return {
            name: '小明'
        }
    }
}
let container = {
    sprites: {
        boy: sptire
    }
}

core.addContainer('human', container)

let boy = core.make('human', 'boy', {
    name: '小強'
})

console.log(boy.name) // 小強
```

---

### Vue

說 `oobe` 是為了 `vue` 量身打造並不過分，以下是採用 `vuetify` 與 `webpack` 開發的範例。

#### oobe.js

```js
import vue from 'vue'
import oobe from 'oobe'
import container from './container'

let core = new oobe()
core.addContainer('container', container)
vue.prototype.$oobe = core
```

#### app.vue

```html
<template>
    <div>
        <v-text-field
            v-show="target.$isHidden('name')"
            v-model="target.name"
            :label="target.$meg('$name')"
            :rules="target.$rules('name')"
            :disabled="target.$isFixed('name')">
        </v-text-field>
        <v-btn @click.stop="submit()"></v-btn>
    <div>
</template>
<script>
    import './oobe.js'
    export default {
        props: {
            sprite: {
                required: true,
                default() { return this.$oobe.make('container', 'sprite') }
            }
        },
        methods: {
            submit() {
                this.$emit('submit')
            }
        },
        destroyed() {
            this.target.$dead()
        }
    }
</script>
```

---

## Document

[Core](https://softchef.github.io/oobe/document/document)

[Container](https://softchef.github.io/oobe/document/document)

[Sprite](https://softchef.github.io/oobe/document/document)

[Plugin](https://softchef.github.io/oobe/document/document)

[Helper](https://softchef.github.io/oobe/document/document)

[Rule](https://softchef.github.io/oobe/document/document)

[Locale](https://softchef.github.io/oobe/document/document)

---

## Other

[Version](https://softchef.github.io/oobe/version)

[LinkSpriteImg]: https://softchef.github.io/oobe/assets/like_sprite.jpg
[Flow]: https://softchef.github.io/oobe/document/flow.png
[npm-image]: https://img.shields.io/npm/v/oobe.svg
[npm-url]: https://npmjs.org/package/oobe

<br>

<p align="center"><img src="https://softchef.github.io/oobe/assets/logo.png"></p>

<p align="center" style="font-size:2em">javascript view model library</p>

---

[![NPM Version][npm-image]][npm-url]

[example](https://softchef.github.io/oobe/example/)

[document](https://softchef.github.io/oobe/docs/)

[getting started](https://softchef.github.io/oobe/started/)

oobe目的為原始資料與控制器之間的view model，具有集合、事件、資料轉換與驗證方法。

下圖可以理解使用oobe的心情：

![fat_guy](https://softchef.github.io/oobe/assets/happy_fat_guy.gif)

---

## 概念

oobe的概念是來自從vue表單組件中抽出model property時所建構的，當時的目的是為了讓update與create兩個表單能夠實例化同一組instance即可，但意外的是這樣的設計在我們遇到資料格式與狀態的轉換之間有極好的效果，因此決定編寫此library作為一個設計典範。

> 雖然oobe是為了vue環境編寫，但它並不是vuejs的套件。

```html
<!-- Bad -->
<template>
    <div>
        <input v-model="user.name">
        <input v-model="user.phonenumber">
    </div>
</template>
<script>
    export default {
        data() {
            return {
                user: {
                    name: '',
                    phonenumber: ''
                }
            }
        }
    }
</script>
```

```html
<!-- Good -->
<template>
    <div>
        <input v-model="user.name">
        <input v-model="user.phonenumber">
    </div>
</template>
<script>
    // 實際上不會這樣宣告，推薦方法請參考教學文件的-實戰vue
    // 這樣對比起來好像麻煩很多...
    import Oobe from 'oobe'
    let oobe = new Oobe()
    let container = {
        sprites: {
            profile: {
                body() {
                    return {
                        name: '',
                        phonenumber: ''
                    }
                }
            }
        }
    }
    oobe.join('user', container)
    export default {
        data() {
            return {
                user: oobe.make('user', 'profile')
            }
        }
    }
</script>
```

oobe參照了backbone與vue-mc，前者自成一格難以引進vue開發，而後者太過強大，它甚至處理了vuex和axios的工作，而oobe是一個專注在model處理的系統。

### 起源於vue與vuex之間缺乏model

vue-mc有發現component與store中間少了一層model，但vuex並沒有直接提供解決方案。

![vuex][vuex]

### Nodejs

oobe與其他model最大的差異在於專注在視圖處理，我們為它內置了以下這簡易的模式，這也是雖然它可以運行在nodejs但不推薦的原因，我們希望它能夠依據資料來回決定呈現的樣子，這在後端的風險太大了。

![data][data]

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

## 支援環境

支援 es6 與 nodejs8.10 以上。

> 理論上能夠被IE11支持，但defaultView因為採用proxy所以會被忽略。

---

## Other

[medium](https://medium.com/sensor-live/oobe-javascript-view-model-library-a6ada8d56566)

[versions](https://softchef.github.io/oobe/version)

[npm-image]: https://img.shields.io/npm/v/oobe.svg
[npm-url]: https://npmjs.org/package/oobe

[vuex]: data:image/png;base64,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

[data]: data:image/png;base64,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
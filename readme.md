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

![vuex](https://softchef.github.io/oobe/assets/vuex.png)

### Nodejs

oobe與其他model最大的差異在於專注在視圖處理，我們為它內置了以下這簡易的模式，這也是雖然它可以運行在nodejs但不推薦的原因，我們希望它能夠依據資料來回決定呈現的樣子，這在後端的風險太大了。

![data](https://softchef.github.io/oobe/assets/data.png)

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

<br>

<p align="center"><img src="https://softchef.github.io/oobe/assets/logo.png"></p>

<p align="center" style="font-size:2.5em">javascript view model library</p>

---

[![NPM Version][npm-image]][npm-url]

[example](https://softchef.github.io/oobe/example/)

[document](https://softchef.github.io/oobe/docs/)

[getting started](https://softchef.github.io/oobe/started/)

oobe目的為原始資料與控制器之間的中介者，具有資料轉換與驗證方法。

他將為你帶來：

* 降低前後端的耦合。
* 模組化提高通用性。
* 為表單操作帶來良好的開發體驗。
* 驗證、狀態等模式提高操作安全。

下圖可以理解使用oobe的心情：

![fat_guy](https://softchef.github.io/oobe/assets/happy_fat_guy.gif)

---

## Quick start

```js
import Oobe from 'oobe'
let oobe = new Oobe()
let staff = {
    body() {
        return {
            name: 'dave'
        }
    }
}
let container = {
    sprites: {
        staff
    }
}
oobe.join('company', container)
let dave = oobe.make('company', 'staff').$born()
let steve = oobe.make('company', 'staff').$born({ name: 'steve' })
console.log(dave.name) //dave
console.log(steve.name) // steve
```

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

## Other

[medium]()

[versions](https://softchef.github.io/oobe/version)

[npm-image]: https://img.shields.io/npm/v/oobe.svg
[npm-url]: https://npmjs.org/package/oobe

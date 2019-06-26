<br>

<p align="center"><img src="https://softchef.github.io/oobe/assets/logo.png"></p>

<p align="center" style="font-size:2.5em">javascript model library</p>

---

[![NPM Version][npm-image]][npm-url]

[document](https://softchef.github.io/oobe/docs/)

[getting started](https://softchef.github.io/oobe/started/)

[demo](https://softchef.github.io/oobe/web/)

oobe目的為原始資料與控制器之間的中介者，具有資料轉換與驗證方法。

他將為你帶來：

* 降低前後端的耦合。
* 模組化提高通用性。
* 為表單操作帶來良好的開發體驗。
* 驗證、狀態等模式提高操作安全。
* 具有model的特性，可統一 js 與 nodejs 前後端的組件運作。

以下圖可以理解oobe在每個地方所擔任的腳色：

![flow](https://softchef.github.io/oobe/assets/flow.png)

下圖可以理解使用oobe的心情：

![fat_guy](https://softchef.github.io/oobe/assets/happy_fat_guy.gif)

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

## Other

[Version](https://softchef.github.io/oobe/version)

[npm-image]: https://img.shields.io/npm/v/oobe.svg
[npm-url]: https://npmjs.org/package/oobe

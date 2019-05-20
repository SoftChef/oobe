# oobe

oobe目的為原始資料與控制器之間的中介者，具有資料轉換與驗證方法。

他將為你帶來：

* 降低前後端的耦合。
* 模組化提高通用性。
* 為表單操作帶來良好的開發體驗。
* 驗證、狀態與靈魂模式提高操作安全。
* 具有model的特性，可統一 js 與 nodejs 前後端的操作模式。

![Like Sprite][LinkSpriteImg]

## Install

[![NPM Version][npm-image]][npm-url]

### Html

```html
<script src="./dist/index.js"></script>
```

### Webpack or Nodejs

```bash
npm i --save oobe
```

## How to use

[Document][DocLink]

### Html

```html
<script>
    let core = new oobe()
</script>
```

### Webpack

```js
import oobe from 'oobe'
let core = new oobe()
```

### Nodejs

```js
let oobe = require('oobe')
let core = new oobe()
```

## First Sprite

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

## Other

[Version](https://softchef.github.io/oobe/document/version)

[DocLink]: https://softchef.github.io/oobe/document/document
[LinkSpriteImg]: https://softchef.github.io/oobe/document/like_sprite.jpg
[Flow]: https://softchef.github.io/oobe/document/flow.png
[npm-image]: https://img.shields.io/npm/v/oobe.svg
[npm-url]: https://npmjs.org/package/oobe
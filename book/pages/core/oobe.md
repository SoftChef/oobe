# oobe

* 開始
  * [實例化與引用專案](#%e5%af%a6%e4%be%8b%e5%8c%96%e8%88%87%e5%bc%95%e7%94%a8%e5%b0%88%e6%a1%88)
  * [引用oobe](#%e5%bc%95%e7%94%a8oobe)
* 註冊
  * [Container - `join`](#join)
  * [Package - `addon`](#addon)
  * [Plugin - `plugin`](#plugin)
* 建立
  * [`make`](#make)
  * [`batch`](#batch)
  * [`collection`](#collection)
* 事件
  * [`on`](#on)
  * [`onOnce`](#ononce)
  * [`off`](#off)
  * [`emit`](#emit)
  * [`onDevError`](#ondeverror)
* 其他
  * [`meg`](#meg)
  * [`getRules`](#getrules)
  * [`setLocale`](#setlocale)
  * [`instanceof`](#instanceof)
  * [`helper`](#helper)

---

### 開始

#### 實例化與引用專案

我們推薦使用`webpack`開始你的專案，以下教學皆會以`webpack`環境為主。

```js
import Oobe from 'oobe'
import container from './containers/myContainer'

let oobe = new Oobe()

oobe.join('myContainer', myContainer)

export default oobe
```

#### 引用oobe

你可以再`vue`中綁定[`prototype`](https://v1-cn.vuejs.org/guide/plugins.html)來引用`oobe`，也可以藉由直接引用來使用它：

```js
import vue from 'vue'
import oobe from './oobe'

vue.prototype.$oobe = oobe
```

---

### 註冊

#### Join

註冊@Container。

> `oobe`不允許個別建立@Sprite，只能由Container註冊。

```js
oobe.join(name, data) => null
```

| Param | Type      | Description         |
| ---   | ---       | ---                 |
| name  | string    | Container name.     |
| data  | container | _No description_    |

#### Addon

註冊@package。

```js
oobe.addon(data) => null
```

| Param | Type      | Description         |
| ---   | ---       | ---                 |
| data  | @package  | _No description_    |

#### Plugin

註冊@plugin。

```js
oobe.plugin(data) => null
```

| Param | Type      | Description         |
| ---   | ---       | ---                 |
| data  | @plugin   | _No description_    |

---

### 建立

#### make

回傳指定的@Sprite。

```js
oobe.make(containerName, spriteName, options) => Sprite
```

| Param         | Type      | Description         |
| ---           | ---       | ---                 |
| containerName | string    | Container name.     |
| spriteName    | string    | Sprite name.        |
| options?      | object    | _No description_    |
| options.save? | boolean   | 使否快取原始資料       |

#### batch

批次建立指定的@Sprite。

> 批次建立的Sprite會被自動執行@`$born`，如果沒有特殊需求請使用[`collection`](#collection)。

```js
oobe.batch(containerName, spriteName, items, options) => Array<Sprite>
```

| Param         | Type      | Description         |
| ---           | ---       | ---                 |
| containerName | string    | Container name.     |
| spriteName    | string    | Sprite name.        |
| items         | array     | Origin items.       |
| options?      | object    | _No description_    |
| options.save? | boolean   | 使否快取原始資料       |

#### collection

批次建立指定的@Collection。

```js
oobe.collection(containerName, spriteName, options) => Collection
```

| Param         | Type      | Description         |
| ---           | ---       | ---                 |
| containerName | string    | Container name.     |
| spriteName    | string    | Sprite name.        |
| options?      | object    | _No description_    |
| options.save? | boolean   | 使否快取原始資料       |

---

### 事件處理

`oobe`可以監聽事件，詳細應用請見@Event。

#### on

監聽一則@Event。

```js
oobe.on(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### off

關閉監聽事件。

```js
oobe.off(eventName, id) => null
```

| Param     | Type    | Description             |
| ---       | ---     | ---                     |
| eventName | string  | Event name.             |
| id        | string  | Listener id.            |

##### onOnce

監聽的事件只觸發一次。

```js
oobe.onOnce(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### emit

發送事件。

```js
oobe.emit(eventName, ...args) => null
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| ...args   | args     | Emit items.             |

#### onDevError

當`oobe`擲出不符合規範的錯誤警告時，只能知道錯誤訊息而非發生錯誤的對象，這是給予開發人員攔截錯誤細節的方法。

> `onDevError`並不是宣告在實例化對象。

```js
import Oobe from 'oobe'
Oobe.onDevError(data => {}) => null
```

| Param             | Type   | Description             |
| ---               | ---    | ---                     |
| data              | object | _No description_        |
| data.name         | string | Error name.             |
| data.target       | any    | Error target.           |
| data.message      | string | Error message.          |
| data.functionName | strung | Error function.         |

---

### 其他

#### meg

回傳@package訂製的語系。

```js
oobe.meg(name, value) => String
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| name     | string  | Message name            |
| value?   | any     | Message Params          |

#### getRules

回傳@package定義的Rules也可以加入自定義的Function，詳情可見@package。

```js
oobe.getRules(rules: Array<String|Function>) => Array<Function>
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| locale    | string   | Locale name.            |

#### setLocale

設定`oobe`的@Locale。

```js
oobe.setLocale(locale) => null
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| locale    | string   | Locale name.            |

#### instanceof

驗證實例化對象是否為指定的對象。

```js
oobe.instanceof(containerName, spriteName, sprite) => Boolean
```

| Param         | Type    | Description             |
| ---           | ---     | ---                     |
| containerName | string  | Container name.         |
| spriteName    | string  | Sprite name.            |
| containerName | @sprite | Target sprite.          |

#### helper

@Helper的接口。

```js
oobe.helper => Helper
```

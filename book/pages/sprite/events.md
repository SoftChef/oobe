## Sprite Events

Sprite的系統事件，細節可見[Event](../core/event.md)。

  * [`$ready`](#ready)
  * [`$export`](#export)
  * [`$reset`](#reset)
  * [`$error`](#error)
  * [`$init`](#init)
  * [`$loaderSuccess`](#loadersuccess)
  * [`$loaderError`](#loadererror)

---

#### $ready

在呼叫[`$born`](./operational.md#born)後觸發。

```js
sprite.$on('$ready', (event) => { ... })
sprite.$born()
```

---

#### $export

宣告[`$export`](./operational.md#export)時觸發。

```js
sprite.$on('$export', (event, data) => { ... })
sprite.$export()
```

| Param         | Type    | Description         |
| ---           | ---     | ---                 |
| data          | object  | _No description_    |
| data.dist     | string  | Dist name.          |
| data.result   | any     | Export result.      |

---

#### $reset

當宣告[`$reset`](./operational.md#reset)時觸發。

```js
sprite.$on('$reset', (event) => { ... })
```

---

#### $error

在觸發[$setError](./operational.md#seterror)時觸發。

```js
sprite.$on('$error', (event, error) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| error         | any     | `$setError`攜帶的參數   |

---

#### $init

在Core宣告[`make`](../core/oobe.md#make)或Collection宣告[`write`](../collection/operational.md#write)系列時會被創造的Sprite對象會觸發該事件。

```js
sprite.$on('$init', (event, target) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| target        | sprite  | 實例化對象              |

---

#### $loaderSuccess

當[Loader](../sprite/structure.md#loaders)成功宣告`done`的當下觸發。

```js
sprite.$on('$loaderSuccess', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.name     | string  | Loader name.          |
| data.result   | string  | Success or error response. |

---

####  $loaderError

當[Loader](../sprite/structure.md#loaders)成功宣告`error`的當下觸發。

```js
sprite.$on('$loaderError', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.name     | string  | Loader name.          |
| data.error    | any     | Error message.        |

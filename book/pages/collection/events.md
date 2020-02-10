## Collection Events

Collection的系統事件，細節可見[Event](../core/event.md)。

 * [`$init`](#init)
 * [`$writeSuccess`](#writesuccess)
 * [`$writeReject`](#writereject)
 * [`$writeAsyncDone`](#writeasyncdone)
 * [`$fetch`](#fetch)
 * [`$fetchFail`](#fetchfail)
 * [`$clear`](#clear)
 * [`$loaderSuccess`](#loadersuccess)
 * [`$loaderError`](#loadererror)

---

#### $init

在[Core](../core/oobe.md)宣告[`collection`](../core/oobe.md#collection)時會被創造的Collection對象會觸發該事件。

```js
collection.on('$init', (event) => { ... })
```

---

#### $writeSuccess

在[`write`](./operational.md#write)成功後觸發。

```js
collection.on('$writeSuccess', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.key      | string  | Write key.            |
| data.sprite   | sprite  | 實例化Sprite對象        |
| data.source   | object  | 寫入的原始資料          |
| data.onlyKey  | boolean | 該次寫入是藉由[onlyKey](./operational.md#batchwriteonlykeys) |

---

#### $writeReject

在[`write`](./operational.md#write)宣告`reject`時觸發。

```js
collection.on('$writeReject', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.key      | string  | Write key.            |
| data.sprite   | sprite  | 實例化Sprite對象        |
| data.source   | object  | 寫入的原始資料          |
| data.message  | any     | Reject message.       |
| data.onlyKey  | boolean | 該次寫入是藉由[onlyKey](./operational.md#batchwriteonlykeys) |

---

#### $writeAsyncDone

執行[`batchWriteAsync`](./operational.md#batchwriteasync)整批寫入完畢後觸發。

```js
collection.on('$writeAsyncDone', (event) => { ... })
```

---

#### $fetch

執行[`fetch`](./operational.md#fetch)時觸發。

```js
collection.on('$fetch', (event, sprite) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| sprite        | sprite  | Fetch sprite.         |

---

#### $fetchFail

執行[`fetch`](./operational.md#fetch)時找不到對象時觸發。

```js
collection.on('$fetchFail', (event, key) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| key           | string  | Fetch key.            |

---

#### $clear

執行[`clear`](./operational.md#clear)時觸發。

```js
collection.on('$clear', (event) => { ... })
```

---

#### $loaderSuccess

當[Loader](./structure.md#loaders)成功宣告`done`的當下觸發。

```js
collection.on('$loaderSuccess', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.name     | string  | Loader name.          |

---

#### $loaderError

當[Loader](./structure.md#loaders)成功宣告`error`的當下觸發。

```js
collection.on('$loaderError', (event, data) => { ... })
```

| Param         | Type    | Description           |
| ---           | ---     | ---                   |
| data          | object  | _No description_      |
| data.name     | string  | Loader name.          |
| data.error    | any     | Error message.        |

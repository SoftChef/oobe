## Sprite Contorl

* 事件處理：
  * `on`
  * `off`
  * `emit`
* 其他：
  * `size`
  * `items`
  * `dirty`
  * `views`
  * `methods`
  * `loaders`
  * `utils`
  * `configs`
  * `helper`
  * `parent`
  * `setDirty`
  * `forEach`
  * `getBodys`
  * `getOrigins`
  * `getExports`
  * `isChange`
  * `validate`
  * `distAll`
  * `has`
  * `fetch`
  * `write`
  * `batchWrite`
  * `batchWriteOnlyKeys`
  * `batchWriteAsync`
  * `remove`
  * `clear`
  * `toKey`

---

### 事件處理

#### On

在系統執行時我們會發送開頭以`$`命名的事件：

```js
let sprite = oobe.make(...)
sprite.$on('$ready', () => console.log('ready'))
sprite.$born() // 'ready'
```

#### Off

關閉事件有多種方法：

```js
// ...
sprite.$on('$ready', { listener } => listener.off())
// ...
```

```js
// ...
let { id } = sprite.$on('$ready', event => {})
sprite.$off('$ready', id)
// ...
```

```js
// ...
let listener = sprite.$on('$ready', event => {})
sprite.$off('$ready', listener)
// ...
```

```js
// ...
let listener = sprite.$on('$ready', event => {})
listener.off()
// ...
```

##### Once

如果你只想觸發一次，`$onOnce`是你的好選擇：

```js
// ...
sprite.$onOnce('somethingEvent', event => {})
// ...
```

#### Emit

你也可以自定義自己的事件：

```js
// ...
sprite.$on('myEvent', (event, p1, p2, p3) => {
    console.log(p1, p2, p3) // 1, 2, 3
})
sprite.$emit('myEvent', 1, 2, 3)
// ...
```

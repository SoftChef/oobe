## Event

在建立[Oobe](./oobe.md)、[Sprite](../sprite/structure.md)、[Collection](../collection/structure.md)等都能接收或發送Event，以下是通用邏輯：

* 監聽事件：[On](#on)
* 移除監聽：[Off](#off)
* 發送事件：[Emit](#emit)

---

### On

監聽發送的事件，事件會藉由`callback`獲取。

> 在系統會發送開頭以`$`命名的事件。

```js
let sprite = oobe.make(...)
sprite.$on('$ready', () => console.log('ready'))
sprite.$born() // 'ready'
```

#### Once

只觸發一次事件，不需要觸發後手動關閉：

```js
// ...
sprite.$onOnce('somethingEvent', event => {})
// ...
```

#### 事件接收

接收的`callback`第一個參數固定為Event對象。

```js
let sprite = oobe.make(...)
let listener = sprite.$on('$ready', (event, ...args) => {
    console.log(event.listener.id) // xxxxx-xx-xx-xxxxx
})
```

| Param        | Type                 | Description             |
| ---          | ---                  | ---                     |
| type         | string               | Event caller type.      |
| target       | sprite or collection | 發送事件的對象             |
| context      | object               | 冒泡傳遞的事件上下文        |
| listener     | string               | _No description_        |
| listener.id  | function             | 事件id                  |
| listener.off | function             | 關閉事件                 |

#### 冒泡傳遞

所有的事件都會向上傳遞，最後傳到`oobe`被觸發，冒泡途徑是這樣的：

```bash
unit or collection(實例化對象) -> sprite -> container -> core
```

所以要在`oobe`監聽到`sprite $ready`事件，只要如下定義：

```js
let oobe = new Oobe()
let sprite = { ... }
oobe.join('demo', {
    sprites: { sprite }
})
oobe.on('container.sprite.unit.$ready', () => {
    console.log('hello')
})
oobe.make('demo', 'sprite').$born() // hello
```

---

### Off

關閉監聽，方法有以下幾種：

```js
// ...
sprite.$on('$ready', ({ listener }) => listener.off())
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

---

### Emit

你也可以自定義發送事件：

```js
// ...
sprite.$on('myEvent', (event, p1, p2, p3) => {
    console.log(p1, p2, p3) // 1, 2, 3
})
sprite.$emit('myEvent', 1, 2, 3)
// ...
```

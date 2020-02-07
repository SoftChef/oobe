## Sprite Event

* On
* Once
* Off
* Emit
* 冒泡傳遞

## Event

* Listener

### How To Use

#### On

監聽發送的事件，事件會藉由`callback`獲取。

> 在系統會發送開頭以`$`命名的事件：

```js
let sprite = oobe.make(...)
sprite.$on('$ready', () => console.log('ready'))
sprite.$born() // 'ready'
```

##### 事件接收

接收的`callback`第一個參數為@Event對象。

> `$on`呼叫後會回傳@Listener。

```js
let sprite = oobe.make(...)
let listener = sprite.$on('$ready', (listener, ...args) => {
    console.log(listener.id) // xxxxx-xx-xx-xxxxx
})
```

#### Off

關閉監聽，方法有以下幾種：

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

只觸發一次事件，不需要觸發後手動關閉：

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

## 冒泡傳遞

所有的事件都會向上傳遞，最後傳到core被觸發。

冒泡途徑是這樣的：

unit or collection(實例化對象) -> sprite -> container -> core

所以要在core監聽到sprite born事件，只要如下定義：

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

### Event

#### channelName

#### Listener

該物件有[`off`](#off)與`id`兩個屬性，而之後的屬性則由發送者決定。

```js
{
    listener: {
        id: 'xxxxx-xxx-xxx-xxxxxxx',
        off: Off
    },
    channelName: '$error',
    target: Sprite || Collection,
    context: Event || undefined,
    type: 'unit'
}
```
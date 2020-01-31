# System

> System Event是獨立的事件系統，跟其他event無關。

## OnDevError

關於`oobe`系統錯誤處理往往只知道訊息不知道對象，可以在開發狀態下使用`onDevError`監控錯誤對象。

```js
import Oobe from 'oobe'

Oobe.onDevError(({ name, target, message, functionName }) => {
    console.log(message)
})

let oobe = new Oobe()

oobe.make('hello', 'world') // Container name(hello) not found.
```

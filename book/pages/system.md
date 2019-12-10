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

## OnPropertySet

當任一精靈參數有改動時被觸發。

```js
import Oobe from 'oobe'

Oobe.onPropertySet(({ sprite, key, value }) => {
    console.log(value)
})

let oobe = new Oobe()

oobe.join('user', {
    sprites: {
        user: {
            body() {
                return {
                    name: ''
                }
            }
        }
    }
})

let user = oobe.make('user', 'user').$born()
user.name = '123' // 123
```

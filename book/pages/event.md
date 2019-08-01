# Event

*🔬Event是一個實驗性功能，我們將頻繁更動且需要您的回饋。*

```js
let oobe = new Oobe()
oobe.join('demo', {
    sprites: {
        sprite: {
            body() {
                return {
                    name: ''
                }
            }
        }
    }
})
let sprite = oobe.make('demo', 'sprite')
sprite.$on('$ready', () => {
    console.log('OuO')
})
sprite.$born() // OuO
```

## 移除事件

不知道為啥，移除事件的方法多元的跟鬼一樣。

```js
// 使用context內的listener
sprite.$on('$ready', ({ listener }) => {
    listener.off()
})

// 使用外部的listener
let listener = sprite.$on('$ready', () => {
    console.log('OuO')
})
sprite.$off('$ready', listener)
sprite.$off('$ready', listener.id)
listener.off()
```

## 系統事件

系統事件會以`$`字號做開頭，由程式內部操作時觸發，有什麼可用的系統事件請參閱文件。

---

## 自訂事件

使用`$emit`發送事件可以觸發自訂的事件。

```js
sprite.$on('myEvent', (context, param1, param2) => {
    console.log(param1) // 1234
    console.log(param2) // 5678
})
sprite.$emit('myEvent', '1234', '5678')
```

---

## 冒泡傳遞

所有的事件都會向上傳遞，最後傳到core被觸發。

冒泡途徑是這樣的：

unit(實例化對象) -> sprite or collection -> container -> core

所以要在core監聽到sprite born事件，只要如下定義：

```js
let oobe = new Oobe()
let sprite = {
    body() {
        return {
            name: ''
        }
    }
}
oobe.join('demo', {
    sprites: { sprite }
})
oobe.on('container.sprite.unit.$ready', () => {
    console.log('OuO')
})
oobe.make('demo', 'sprite').$born() // OuO
```

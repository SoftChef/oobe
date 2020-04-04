## Plugin

Plugin顧名思義就是擴展`oobe`沒有的功能。

```js
let oobe = new Oobe()

class MyFirstPlugin {
    constructor(oobe) {
        // do something...
    }
}

oobe.plugin(MyFirstPlugin)
```

---

### 綁定方法

你可以使用`$init`事件在實例化Sprite綁定方法。

```js
let oobe = new Oobe()

class MyFirstPlugin {
    constructor(oobe) {
        oobe.on('container.sprite.unit.$init', (context, sprite) => {
            sprite.$helloworld = function() {
                console.log('hello world')
            }
        })
        oobe.on('container.sprite.collection.$init', (context, collection) => {
            collection.helloworld = function() {
                console.log('hello world')
            }
        })
    }
}
```

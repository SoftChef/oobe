## Sprite Contorl

Sprite大量內置了操作功能與狀態，免除複雜且難以維護的繼承樹。

* 流程處理
  * [`$born`](#born)
  * [`$toOrigin`](#toorigin)
  * [`$setError`](#seterror)
  * [`$reset`](#reset)
* 操作處理
  * [`$copy`](#copy)
  * [`$out`](#out)
  * [`$revive`](#revive)
  * [`$dead`](#dead)
  * [`$live`](#live)
* 視圖呈現：
  * [`$dist`](#dist)
  * [`$export`](#export)
  * [`$show`](#show)
  * [`$isFixed`](#isfixed)
  * [`$isHidden`](#ishidden)
  * [`$isChange`](#ischange)
  * [`$validate`](#validate)
  * [`$rules`](#rules)
  * [`$v($views)`](#vviews)
  * [`$o($loaders)`](#oloaders)
  * [`$meg`](#meg)
  * [`$error`](#error)
* 資料處理：
  * [`$body`](#body)
  * [`$keys`](#keys)
  * [`$put`](#put)
  * [`$raw`](#raw)
  * [`$map`](#map)
* 方法處理：
  * [`$fn`](#fn)
  * [`$bind`](#bind)
* 事件處理：
  * [`$on`](#on)
  * [`$off`](#off)
  * [`$emit`](#emit)
* 其他：
  * [`$helper`](#helper)
  * [`$toObject`](#toobject)
  * [`$config`](#config)
  * [`$distName`](#distname)
  * [`$parent`](#parent)
  * [`$ready`](#ready)
  * [`$self`](#self)
  * [`$utils`](#utils)

---

### 流程處理

#### $born

初始化資料，觸發會使狀態@`$ready`為`true`且並發@event。

```js
sprite.$born(params) => self
```

| Param    | Type    | Description |
| ---      | ---     | ---         |
| params?  | object  | Origin data |

#### $toOrigin

回傳@Origin的資料。

```js
sprite.$toOrigin() => any
```

#### $reset

將屬性資料切換成宣告[`$born`](#born)前的狀態。

```js
sprite.$reset() => null
```

#### $setError

設定Sprite為錯誤並加入錯誤訊息且發送@event。

```js
sprite.$setError(error) => null
```

| Param    | Type    | Description   |
| ---      | ---     | ---           |
| error?   | any     | Error message |

---

### 操作處理

在使用雙向綁定的表單操作狀態的時候，容易造成修改同一對象導致全局狀態被改變，這類情境常發生在彈出式表單，例如以下例子：

```html
<template>
    <!--當你修改這個值得同時store的狀態會被改變-->
    <input v-model="user.name">
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters: {
            user: 'user'
        }
    }
}
</script>
```

在這類操作的情境下，通常會把`user`物件分離出來，直到修改完畢再進行`commit`的行為，來避免取消操作造成的永久性的狀態停留。

#### $copy

觸發當下Sprite的`$toOrigin()`並用回傳的資料實例化一個新的Sprite。

```js
sprite.$copy(options) => sprite
```

| Param         | Type    | Description         |
| ---           | ---     | ---                 |
| options?      | object  | Sprite make options |
| options.save? | boolean | @save               |

##### 雖然可以直接複製對象進行修改，但反覆尋找修改對象並做資料轉換是個繁雜的行為，因此誕生了以下操作方法：

#### $out

[`$copy`](#copy)本Sprite並綁定目標，能使操作[$revive](#revive)時了解更動對象。

> 被宣告`$out`的對象會進入`dead`的狀態，本狀態會使數值無法被修改。

```js
sprite.$out() => sprite
```

#### $revive

把修改資料寫入[$out](#out)並回傳宣告的對象：

> 被宣告`$revive`的對象會進入`dead`的狀態，本狀態會使數值無法被修改。

```js
sprite.$revive() => sprite
```

#### $dead

放棄本次的修改並回傳宣告的對象：

```js
sprite.$dead() => sprite
```

#### $live

該Sprite是否進入`dead`的狀態，是為`false`。

```js
sprite.$live => Boolean
```

#### 最佳實踐

```html
<template>
    <div v-if="targetUser && targetUser.$live">
        <input v-model="targetUser.name">
        <button @click.stop="save">save</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            targetUser: null
        }
    },
    computed: {
        ...mapGetters: {
            user: 'user'
        }
    },
    mounted() {
        this.targetUser = this.user.$out()
    },
    methods: {
        save() {
            // 經過targetUser修改的值會複寫回user
            this.targetUser.$revive()
        }
    },
    destroyed() {
        if (this.targetUser.$live) {
            this.targetUser.$dead()
        }
    }
}
</script>
```

---

### 視圖呈現

#### $dist

更改當前狀態，可更動狀態請見@Dists。

> `$dist`為`$distortion`方法的簡寫。

```js
sprite.$dist(name) => self
```

| Param    | Type    | Description     |
| ---      | ---     | ---             |
| name     | string  | Distortion Name |

#### $export

根據當前或指定狀態輸出值，詳情請見@Dists。

```js
sprite.$export(name, ...args) => any
```

| Param    | Type    | Description               |
| ---      | ---     | ---                       |
| name?    | string  | 指定輸出狀態，省略則為當前狀態 |
| ...args  | any     | 輸出狀態可以接收參數         |

#### $show

指定數值是否不是`fixed`的狀態，詳情請見@Dists。

```js
sprite.$show(name) => Boolean
```

| Param    | Type    | Description               |
| ---      | ---     | ---                       |
| name     | string  | Target                    |

#### $isFixed

指定數值是否為`fixed`的狀態，詳情請見@Dists。

```js
sprite.$isFixed(name) => Boolean
```

| Param    | Type    | Description               |
| ---      | ---     | ---                       |
| name     | string  | Target                    |

#### $isHidden

指定數值是否為`hidden`的狀態，詳情請見@Dists。

```js
sprite.$isHidden(name) => Boolean
```

| Param    | Type    | Description               |
| ---      | ---     | ---                       |
| name     | string  | Target                    |

#### $isChange

當前數值是否與宣告[`$born`](#born)時相同。

> 該方法在@`options.save`宣告為`false`時無效。

```js
sprite.$isChange(key) => Boolean
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| key?     | string  | 可以只針對某一個屬性進行驗證 |

#### $validate

驗證屬性使用與@Rule的規則相同。

```js
sprite.$validate() => {
    success: Boolean,
    result: {
        // 如果是屬性回傳驗證錯誤字串
        [key]: String,
        // 如果是Ref對象回傳validate物件
        [key]: {
            success: Boolean,
            result: Object
        }
    }
}
```

#### $rules

回傳驗證的方法。

```js
sprite.$rules(name, extra) => Array<Function>
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| name     | string  | 指定的屬性                |
| extra?   | array   | 擴增的驗證方法             |

#### $v($views)

經過計算的唯讀屬性，詳情請見@Views。

> `$v`為`$views`屬性的簡寫。

```js
sprite.$v => Object
```

#### $o($loaders)

狀態控制單元，詳情請見@Loaders。

> `$o`為`$loaders`屬性的簡寫。

```js
sprite.$o => Object
```

#### $meg

語系顯示單元，詳情請見@Locale。

```js
sprite.$meg(name, value) => String
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| name     | string  | Message name            |
| value?   | any     | Message Params          |


#### $error

當你觸發了[`$setError`](#seterror)此屬性會從null改成輸入值，並且回傳@errorMessage的值。

```js
sprite.$error => any
```

---

### 資料處理

#### $body

複製並回傳當下屬性(body)的狀態。

```js
sprite.$body() => Object
```

#### $keys

回傳Body的`key`值。

> 並不包含@Refs的`key`。

```js
sprite.$keys() => Array<String>
```

#### $put

批次寫入Body屬性。

> 該方法也會對應到相對的@Refs的對象。

```js
sprite.$put() => self
```

##### exampale

```js
let sprite = {
    body() {
        return {
            name: '',
            age: null
        }
    }
}
// ...
user.$born()
user.$put({
    name: 'steve',
    age: 20
})
console.log(user.age) // 20
```

#### $raw

回傳[`$born`](#born)傳入的值。

> 若宣告@options.save則無法使用此功能。

```js
sprite.$raw(assign) => any
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| assign?  | object  | 可以對回傳的值進行合成      |

### $map

@Map對象，詳情請見@Map。

```js
sprite.$map => Object
```

---

### 方法處理

#### $fn

使用@Method的接口。

```js
sprite.$fn => Object
```

#### $bind

與JavaScript的Funcition Bind相似，目的是在`function`被引用時能將`this`指向Sprite。

```js
sprite.$bind(name) => Function
```

| Param    | Type    | Description             |
| ---      | ---     | ---                     |
| name     | string  | Method name.            |

##### exampale

```js
let sprite = {
    // ...
    body() {
        return {
            name: 'steve'
        }
    },
    methods: {
        getName() {
            return this.name
        }
    }
    // ...
}
// ...
let getName = user.$bind('getName')
console.log(getName()) // steve
```

---

### 事件處理

#### $on

監聽一則@Event。

```js
sprite.$on(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### $off

關閉監聽事件。

```js
sprite.$off(eventName, id) => null
```

| Param     | Type    | Description             |
| ---       | ---     | ---                     |
| eventName | string  | Event name.             |
| id        | string  | Listener id.            |

##### $onOnce

監聽的事件只觸發一次。

```js
sprite.$onOnce(eventName, callback) => { off: Function, id: String }
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| callback  | function | Event callback.         |

#### $emit

發送事件。

```js
sprite.$emit(eventName, ...args) => null
```

| Param     | Type     | Description             |
| ---       | ---      | ---                     |
| eventName | string   | Event name.             |
| ...args   | args     | Emit items.             |

---

### 其他

#### $helper

@Helper的接口。

```js
sprite.$helper => Helper
```

#### $toObject

將Sprite轉換並回傳成可視化的資料。

> 這是給予開發人員方便開發的功能。

```js
sprite.$toObject() => Object
```

##### exampale

```js
let sprite = {
    // ...
    body() {
        return {
            name: ''
        }
    },
    views: {
        name() {
            return this.name
        }
    }
    // ...
}
// ...
let user = oobe.make('...', 'sprite', { name: 'steve' })
let result = user.$toOject()
console.log(result.$views.name) // steve
user.name = 'dave'
console.log(result.$views.name) // steve
```

#### $config

該對象會指向@container的@config。

```js
sprite.$toObject() => Object
```

#### $distName

當下的distortion的名稱。

```js
sprite.$distName => String
```

#### $parent

如果該Sprite是來自@Refs的參照對象時指向其參照者。

```js
sprite.$distName => Sprite
```

##### exampale

```js
let sprite = {
    // ...
    body() {
        return {
            name: 'steve'
        }
    },
    refs: {
        'sprite2': 'sprite2' 
    }
    // ...
}
let sprite2 = {
    // ...
}
let container = {
    sprites: {
        sprite,
        sprite2
    }
}
// ...
let user = oobe.make('...', 'sprite')
console.log(user.sprite2.$parent.name) // 'steve'
```

#### $ready

是否被呼叫過[`$born`](#born)，有此狀態會回傳`true`。

```js
sprite.$ready => Boolean
```

#### $self

回傳@Self對象，會在[`$born`](#born)宣告後產生。

```js
sprite.$self => Object
```

#### $utils

回傳@container的@utils對象。

```js
sprite.$utils => Object
```

## Sprite

Sprite是oobe的Model單元，負責定義結構與方法。

* 定義結構：[Body](#body)、[Refs](#refs)
* 生命週期：[Born](#born)、[Origin](#origin)、[Created](#created)
* 私有屬性：[Self](#self)
* 私有方法：[Methods](#methods)、[Views](#views)
* 驗證規則：[Rule](#rule)

進階操作會讓Sprite的複雜度直接上一個層次，但也能使整理操作與檢視的完整性提升一個層次。

* 鍵值映射：Map
* 狀態變化：Export、Distortion
* 狀態管理：Loader
* 錯誤處理：ErrorMessage

---

### Container

Sprite與@Container是共生關係，所有的Sprite都必須運作於其下。

```js
// 建立sprite
let sprite = {
    body() {
        return {
            a: '',
            b: ''
        }
    }
}
// 建立container
let container = {
    sprites: {
        sprite
    }
}
// 註冊進core
oobe.join('container', container)
```

---

### Make

Core實體化Sprite的方法：

```js
let sprite = oobe.make('container name', 'sprite name')
```

#### Save

是否在實體化會保留原始資料，這將影響記憶體與效能的消耗，預設為`true`，通常會在大量的不變動資料下設定為`false`，例如：列表。

> 在關閉Save的情況下有些功能會無法使用，例如：`reset`、`isChange`。

```js
oobe.make('container name', 'sprite name', {
    save: true
})
```

---

### 定義結構

#### Body

定義Sprite的屬性與預設值，例如一個人的名稱與年齡：

```js
let sprite = {
    // ...
    body() {
        return {
            name: '',
            age: null
        }
    }
    // ...
}
```

##### Cache

在第一次實例化後，結構會被Cache，因此並不能使用具有判段式的`body`：

> 嚴格來說model是動態的本身也不合理。

```js
let sprite = {
    // ...
    body() {
        if (something) {
            return {
                name: '',
                age: null
            }
        } else {
            return {
                name: '',
                job: null
            }
        }
    }
    // ...
}
```

##### No Function

由於`body`會在初始化時進行JSON的序列化，因此`function`是不允許出現在結構中的。

```js
let sprite = {
    // ...
    body() {
        return {
            name: '',
            // 這樣在實例化時會擲出錯誤
            getAge() {
                return 11
            }
        }
    }
    // ...
}
```

---

#### Refs

我們建議`body`最好是平面化的資料，由String、Boolean、Number所組成，當需要更複雜的結構時，請使用`refs`。

Refs是指將該Property指向 __相同Container__ 內的Sprite：

```js
let attributes = {
    // ...
    body() {
        return {
            name: ''
        }
    }
    // ...
}
let user = {
    // ...
    refs: {
       attributes: 'attributes'
    }
    // ...
}
let container = {
    sprites: {
        user,
        attributes
    }
}

oobe.join('container', container)

let userSprite = oobe.make('container', 'user').$born({
    attributes: {
        name: 'steve'
    }
})

console.log(userSprite.attributes.name) // steve
```

##### Collection

只要將目標加入`[]`就會轉換成@Collection：

```js
let user = {
    // ...
    refs: {
       attributes: '[attributes]'
    }
    // ...
}
```

---

### 生命週期

在前後端分離的時代，這個中介層的目的是保持我們程式碼品質統一。

![live-cycle][live-cycle]

#### Born

當原始資料(Source)進入的轉換層，預設值如下：

```js
let sprite = {
    // ...
    born(source = {}) {
        return source
    }
    // ...
}
```

因此當我們定義的結構與資料來源有差異時，可以藉由`born`層轉換或汰除資料：

```js
let sprite = {
    // ...
    body() {
        return {
            name: ''
        }
    },
    born(source = {}) {
        return {
            name: source.Name
        }
    }
    // ...
}
// ...
oobe.make('container', 'sprite').$born({
    Name: 'steve'
})
```

#### Origin

既然有轉入就會有轉出，`origin`便是擔此大任的方法：

```js
let sprite = {
    // ...
    body() {
        return {
            name: ''
        }
    },
    born(source = {}) {
        return {
            name: source.Name
        }
    },
    origin() {
        return {
            Name: this.name
        }
    }
    // ...
}
// ...
let user = oobe.make('container', 'sprite').$born({
    Name: 'steve'
})
console.log(user.$toOrigin().Name) // 'steve'
```

其預設值如下：

```js
let sprite = {
    // ...
    origin() {
        return this.$body()
    }
    // ...
}
```

#### Created

觸發`born`之後會將資料分別寫入`body`和`self`，整個流程結束後會觸發`created`：

```js
let sprite = {
    // ...
    created() {
        console.log(this.name) // steve
    }
    // ...
}
```

---

### 私有屬性

#### Self

Self並不是傳統的`private`，而是規格外的屬性，在Self定義的結構比Body靈活的多，其資料會再Born之後觸發：

> Self與Born能共享同一個`source`

```js
let sprite = {
    // ...
    self(source = {}) {
        return {
            name: source.Name
        }
    }
    // ...
}
// ...
console.log(user.$self.name) // steve
```

##### Reset

Reset行為會一同重置Self的狀態：

```js
sprite.$self.name = 'dave'
sprite.$reset()
console.log(sprite.$self.name) // steve
```

---

### 私有方法

#### Methods

顧名思義就是Model自身的方法：

```js
let sprite = {
    // ...
    body() {
        return {
            age: null
        }
    },
    methods: {
        setAge(age) {
            if (age > 0 && age < 200) {
                this.age = age
            }
        }
    }
    // ...
}
// ...
user.$fn.setAge(20)
console.log(user.age) // 20
```

#### Views

基於Getter的模式呈現資料的方法：

```js
let sprite = {
    // ...
    body() {
        return {
            age: null
        }
    },
    views: {
        isAdult() {
            return age >= 18
        }
    }
    // ...
}
// ...
let user = oobe.make('container', 'sprite').$born({
    age: 20
})
console.log(user.$v.isAdult) // true
```

##### Default View

當Views沒有被宣告時可以藉由`defaultView`來返回值，觸發`defaultView`的時機為Key沒被宣告或者是View對象返回值為`!value`(例如null或空字串)。

> Default View採用`proxy`實現，意味著Default View無法再`IE`上運行。

```js
let sprite = {
    // ...
    views: {
        name() {
            return this.name
        }
    },
    defaultView({ key }) {
        return key
    }
    // ...
}
console.log(staff.$v['123']) // 123
```

---

### 驗證規則

#### Rule

你可以針對Body的Key宣告驗證對象，宣告`$validate`後即可回傳結果：

```js
let sprite = {
    // ...
    body() {
        return {
            name: '',
            age: null
        }
    },
    rules: {
        name: ['#ob.string'],
        age: ['#ob.number']
    }
    // ...
}
// ...
let user = oobe.make('container', 'sprite').$born({
    name: 'steve'
    age: '20'
})
console.log(user.$validate().success) // false
console.log(user.$validate().result)
/*
    { 
        name: true,
        age: '必須為數字'
    }
*/
```

##### 自定義驗證規則

在驗證陣列中可以直接添加`function`來做客製的驗證，回傳`true`為通過，`String`意味著錯誤與訊息：

> 當然如果你想客製化一組通用驗證規則，可見@package。

```js
let sprite = {
    // ...
    body() {
        return {
            name: ''
        }
    },
    rules: {
        name: [v => typeof v === 'string' ? true : 'must be a string.']
    }
    // ...
}
```

##### OB Package

我們提供了一組常見的[驗證規則](https://github.com/SoftChef/oobe/blob/master/packages/ob.js)f：

> `ob`攜帶了我們常用的驗證方法並提供了`en-us`與`zh-tw`兩個語系，詳情可見@setLocale。

```js
import Oobe from 'oobe'
import ob from 'oobe/packages/ob'

let oobe = new Oobe()
    oobe.addon(ob)
```

#### Vuetify

Sprite可以宣告`$rules()`回傳一組驗證方法，如果是[Vuetify](http://vuetifyjs.com/)的使用者相信很快就會發現兩者的驗證格式是相同的，意味著你可以這麼做：

```html
<v-form>
    <v-text-field :rules="sprite.$rules()"></v-text-field>
</v-form>
```

---

_如果你是Flash、Unity或相關類型的GC工程師，應該不會對該名詞感到陌生，之所以會這樣命名純粹是認為 __管理繪製所需要的資料__ 這點非常貼切view model所想呈現的效果。_

[live-cycle]: data:image/png;base64,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

[loader]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdkAAAE3CAYAAADmCTvwAAAFUnRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMnd3dy5kcmF3LmlvJTIyJTIwbW9kaWZpZWQlM0QlMjIyMDIwLTAxLTMxVDAxJTNBMzUlM0ExNi4zMTZaJTIyJTIwYWdlbnQlM0QlMjJNb3ppbGxhJTJGNS4wJTIwKE1hY2ludG9zaCUzQiUyMEludGVsJTIwTWFjJTIwT1MlMjBYJTIwMTBfMTRfNiklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkY3OC4wLjM5MDQuODclMjBTYWZhcmklMkY1MzcuMzYlMjIlMjBldGFnJTNEJTIySU96NmpQcjgwWG1QWG42dnZOSGElMjIlMjB2ZXJzaW9uJTNEJTIyMTIuNi4yJTIyJTIwdHlwZSUzRCUyMmRldmljZSUyMiUzRSUzQ2RpYWdyYW0lMjBpZCUzRCUyMnd0cjhWVElWWFdGZWdyd3RLeWhyJTIyJTIwbmFtZSUzRCUyMlBhZ2UtMSUyMiUzRTdWakJjcHN3RlB3YWp1MkFaR3g4YkcyM21UYWQ2WXdQVFk2SzlReWtBcmxDQk55dnJ6RENnQlU3NUZDTFpucXhlU3M5SWUySzFRTUhMNUx5c3lDNzZCdW53QnprMHRMQlN3ZWhPVWJxdHdMMk5lQUh1QVpDRWRNYThscGdIZjhHRGJvYXpXTUtXYSUyQmo1SnpKZU5jSE56eE5ZU043R0JHQ0YlMkYxdVc4NzZkOTJSRUF4Z3ZTSE1SSCUyRkVWRVkxR3FCWmk5OUFIRWJObmIzcHZHNUpTTk5acnlTTENPVkZCOElyQnk4RTU3SyUyQlNzb0ZzSXE3aHBjNjc5T1oxdVBFQktSeVNNS0NyaGElMkZpcHQ4dHZ6d2RmTDl0Z2dmdiUyQkIzM2xSUFR1NmJGUU5WQk9pUUN4bnhrS2VFclZyMG8lMkJCNVNxRWExbFZSMiUyQmVXODUwQ1BRVSUyQmdwUjdyU2JKSlZkUUpCT21XNkdNNVYzbiUyQnI0YTZyMnZvMldwUno0RSUyQnlaSXBkamZkWU5PVmhXMmFZZW95YXZYVnkzcUxHOGF5bmd1Tm5DSnJHWURFaEdDdk5RUkhmVlZ6d1h3Qk5TTVZLSUFSbVQ4MUo4SjBUczBQUFpyUlZRWFdzZlhhRHF6cVdtcjQzMm41UTFvaXExcXFnZCUyQklpelh0OHJVbEtXaGRGJTJGSElvb2xySGZrUUVHaERMcXZtUjRUaElUeU1wUG11blVDbW1oNzAlMkY3dU5YSFJ1cVhYV0dEVWNjcXAlMkI3ZW9RZ1pWeXM2WjRzUTJWeE4zZEZ3RiUyRiUyQjElMkZ1Rlhnb1ZZeHNXb1Y4JTJGRm9pdDZRcUw1VlViRmhhb3dUR3FmaDZGd05ZZXV1TmpISW9qd0Y2MHo1MDlFeDVSdE1nWHBwRXFPanl2NVJpWkJOVyUyQjFYMWU1QVYyMk45RmlMWDhkVkcyVmVkTlZ6MiUyQkE2cnRwTXMxdFZBJTJGeTB2dnRQaTJvOHQ3Nzd6ZlBIUVZPU1ZHdFBIN0xxVHdyVmNvS05weElaV29qWWUyUUd2NGhhclM2UmViWnVDY3ZNdyUyRldhNXZodnZVY01WOXF1T1pxZkhPS3RpcDh2cFNLZVBPVFpkZHp4dEl3S1RIY01uakhINFBYbXFNTDJBJTJCMmhyZk9WRzYlMkYlMkJBQSUzRCUzRCUzQyUyRmRpYWdyYW0lM0UlM0MlMkZteGZpbGUlM0XtcqJdAAAgAElEQVR4Xu2dB7RVxfXGNyLV0ASUBBWCoohRJILYRURZUtREWmygBlEMIkUFgwKCFCmCInbBWAEJ1YoIVoINpQmSqIgoCDwUBKR5/2tP/pdceO9yz713zsyeme+sxYrwzpnZ8/v2zHemnJdiiUQiQRavYsWKWawdVZsgYDnFDthE5J+JDLBbB/LPLv/Qay8mwWQld4LQEyTf9rOJSdZXenz58g/9een6So8v9PzJt/2sL0w2X4p4PuNMESaLJLFFQLqJSY/Plm6+1AuT9UVJwe2QPohIj0+wtE6EJl1f6fE5IbLgIGGygsXxJTTpg4j0+HzJA1vtkK6v9Phs6eZLvTBZX5QU3A7pg4j0+ARL60Ro0vWVHp8TIgsOEiYrWBxfQpM+iEiPz5c8sNUO6fpKj8+Wbr7UC5P1RUnB7ZA+iEiPT7C0ToQmXV/p8TkhsuAgYbKCxfElNOmDiPT4fMkDW+2Qrq/0+Gzp5ku9MFlflBTcDumDiPT4BEvrRGjS9ZUenxMiCw4S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
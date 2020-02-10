## Sprite

Sprite是`oobe`的Model單元，負責定義結構與方法。

* 定義結構：[Body](#body)、[Refs](#refs)
* 生命週期：[Born](#born)、[Origin](#origin)、[Created](#created)
* 私有屬性：[Self](#self)
* 私有方法：[Methods](#methods)、[Views](#views)
* 驗證規則：[Rule](#rule)
* 鍵值映射：[Map](#map)
* 狀態變化：[Distortion](#distortion)
* 狀態管理：[Loader](#loaders)
* 錯誤處理：[ErrorMessage](#error-message)

---

### Container

Sprite與[Container](../corde/container.md)是共生關係，所有的Sprite都必須運作於其下。

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

> 在關閉Save的情況下有些功能會無法使用，例如：[`$reset`](./operational.md#reset)、[`$isChange`](./operational.md#ischange)。

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

只要將目標加入`[]`就會轉換成[Collection](../collection/structure.md)：

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
        age: '必須為數字'
    }
*/
```

##### 自定義驗證規則

在驗證陣列中可以直接添加`function`來做客製的驗證，方法可見[Rule](../core/package.md#rule)：

> 當然如果你想客製化一組通用驗證規則，可見[Package](../core/package.md)。

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

我們提供了一組常見的[驗證規則](https://github.com/SoftChef/oobe/blob/master/packages/ob.js)：

> `ob`攜帶了我們常用的驗證方法並提供了`en-us`與`zh-tw`兩個語系，詳情可見[setLocale](../core/oobe.md#setlocale)。

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

### Map

Map是一個鍵值映射表，我們推薦你把鍵值宣告在Map上而不是Body：

> 運用[Helper](../tools/helper.md)的`setNull`給綁定上Body。

```js
let sprite = {
    map: {
        name: 'name'
    },
    body() {
        return this.$helper.setNull(this.$map)
    }
}
```

#### Born 與 Origin

再多人開發的環境下，我們很難確保命名規則相同，可以使用Born和Origin來轉換命名規則：

```js
let backendResponse = {
    Name: 'steve'
}

let sprite = {
    map: {
        name: 'Name'
    },
    body() {
        return this.$helper.setNull(this.$map)
    },
    origin() {
        return this.$helper.mapping(this.$map, this.$body(), {
            isModel: 'origin',
            reverse: true
        })
    }
}

// ...

let user = oobe.make('container', 'sprite').$born(backendResponse)
console.log(user.name) // steve
console.log(user.$toOrigin().Name) // steve
```

---

### Distortion

Distortion定義了當下Sprite的模式，為了表單開發而生，預設4個狀態，分別為`read`(預設)、`create`、`update`、`delete`，如果需要擴充則需藉由[Container](../core/container.md)定義。

> Distortion是一種狀態，而不是強制性規則，例如`fixed`並不會真正禁止修改。

> `hidden`和`fixed`可以使用Array來指定Key的狀態或使用 `*` 來指定全部的值。

```js
let sprite = {
    body() {
        return {
            name: '',
            createdAt: Date.now()
        }
    },
    dists: {
        read: {
            fixed: '*',
            hidden: []
        },
        create: {
            hidden: ['createdAt']
        },
        delete: {
            export() {
                return this.name
            }
        }
    }
}
```

#### Fixed And Hidden

這個狀態會影響`$isHidden`、`$isFixed`、`$show`三個功能的呈現，如果在Vue開發上可如以下操作：

```html
<template>
    <div>
        <input
            v-model="user.name"
            v-show="user.$show('name')"
            :hidden="user.$isHidden('name')"
            :disabled="user.$isFixed('name')"
        >
        <input
            v-model="user.createdAt"
            v-show="user.$show('createdAt')"
            :hidden="user.$isHidden('createdAt')"
            :disabled="user.$isFixed('createdAt')"
        >
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user: this.$oobe.make('container', 'sprite').$born()
            }
        },
        mounted() {
            // 宣告這個事件會使createdAt的欄位消失
            this.user.$dist('create')
        }
    }
</script>
```

#### Export

指定輸出對象的資料，例如我們在`create`的行為並不需要`createdAt`的屬性：

```js
let user = oobe.make('container', 'sprite').$born({
    name: 'steve',
    createdAt: Date.now()
})
console.log(user.$export()) // steve
// 指定狀態
console.log(user.$export('read')) // { name: 'steve', createdAt: xxxxxx }
```

---

### Loaders

雖然我們已經有Vuex、MobX這類型的狀態管理工具，但多數是針對一個頁面而非一個物件，代表缺乏細部請求的管理，Loader是Sprite的請求狀態管理屬性，流程如下：

![loader][loader]

#### How To Use

假如我們只能擁有員工的名稱，剩下的屬性必須藉由請求的方式獲得：

```js
let sprite = {
    // ...
    body() {
        return {
            name: '',
            age: null
        }
    },
    loaders: {
        fetchAge(done, error) {
            ajax(`getUserAge?name=${this.name}`)
                .then(age => {
                    this.age = age
                    done()
                })
                .error(error)
        }
    }
    // ...
}
// ...
user.$born({ name: 'steve' })
user.$o.fetchAge.start().then(() => {
    console.log(user.age !== null) // true
})
```

#### 載入狀態

剛執行`start`時狀態會進入各種加載狀態，如下：

```js
// ...
sprite.$born({ name: 'steve' })

console.log(sprite.$o.fetchAge.called) // false
console.log(sprite.$o.fetchAge.loading) // false

sprite.$o.fetchAge.start()
    .then(() => {
        console.log(sprite.age !== null) // true
    }).catch(error => {
        console.log(sprite.$o.fetchAge.error !== null) // true
    }).finally(() => {
        console.log(sprite.$o.fetchAge.done) // true
        console.log(sprite.$o.fetchAge.loading) // false
    })

console.log(sprite.$o.fetchAge.done) // false
console.log(sprite.$o.fetchAge.called) // true
console.log(sprite.$o.fetchAge.loading) // true
```

#### 不指定狀態

針對`error`和`loading`兩個狀態擁有不需要指定對象的屬性：

```js
// ...
sprite.$born({ name: 'steve' })
console.log(sprite.$o.$loading) // false
sprite.$o.fetchAge.start().catch(() => {
    console.log(sprite.$o.$error !== null) // true
})
console.log(sprite.$o.$loading) // true
```

#### Seek

每次執行`start`時都會重新清除狀態再請求，而有時候我們已經獲得請求結果，只需要直接執行後續的行為即可：

> 當`start`未執行時`seek`與之同義，而位於`loading`的狀態時，`seek`會一同等待該請求回傳。

```js
// ...
sprite.$o.fetchAge.seek().then(() => { ... })
```

---

#### Error Message

我們接收到的錯誤狀態可能是不規則的，在顯示界面上必須清楚的顯示錯誤的狀態：

```js
let sprite = {
    // ...
    errorMessage(error) {
        return error ? error.meg || null
    }
    // ...
}
// ...
user.$setError({
    meg: 'error'
})
console.log(user.$error) // 'error'
```

---

_如果你是Flash、Unity或相關類型的GC工程師，應該不會對該名詞感到陌生，之所以會這樣命名純粹是認為 __管理繪製所需要的資料__ 這點非常貼切view model所想呈現的效果。_

[live-cycle]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ8AAADxCAYAAADVwDLjAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAF9tJREFUeAHtnXlsFdUXx0/pBpWytBZQFmURIiAoyBYggWBRQBO2AGKULSrRaIBKhISIILKIxVQhMSxWJAhBROAPERGQLWwCASQQlJ0IUls2oRRa5nfP+TGPV5aHbee+mbnzvQl9s91z7/mc+75z7h19E0NElvqHYjABy4p+iGNiYgwmCteYQBz/cWNwcbso+gm4+SXGuNIfX7da4HFVzq3G0S4IgIC/CUA8/B0/9B4EXCMA8XANPRoGAX8TgHj4O37oPQi4RgDi4Rp6NAwC/iYA8fB3/NB7EHCNAMTDNfRoGAT8TQDi4e/4ofcg4BoBiIdr6NEwCPibAMTD3/FD70HANQIQD9fQo2EQ8DcBiIe/44feg4BrBCAerqFHwyDgbwIQD3/HD70HAdcIQDxcQ4+GQcDfBCAe/o4feg8CrhGAeLiGHg2DgL8JQDz8HT/0HgRcIwDxcA09GgYBfxOAePg7fug9CLhGAOLhGno0DAL+JgDx8Hf80HsQcI0AxMM19GgYBPxNAOLh7/ih9yDgGgHjxeOXX36h6tWrRwR89epV4pfY/PnnnxGvw8nbBDIzM+ny5cu3D2ArcASMF4+WLVvSihUrIga2fPnytGHDBnr00UcjXoeTtwmMGzeOUlNTaezYsRCR21gCteVb8Th48CB17tyZKlWqRK1bt6YtW7ZI4Pbs2UN9+/al6dOnU/PmzenIkSP0ySefyLmioiL66KOPqFGjRtSzZ0/6+OOPaerUqXTjxg3iL0NeXh7t2LGD+vfvTxMnTqTatWsTi8+2bdsCNSj+i7PMLTY2lmbMmEFpaWm+FpFp06bJmOB4T5o0KfT61ZUrV1KTJk1kjPF4OX36tKCZNWuWXGdzmjlzJrENHl88FrOzs6XeH3/8Qfv376cOHTqIjZdffjmU3Z49e1bGGWfFXbt2JR63fizqlaL+KteuXbNq1apldevWzdq0aZOlvvhWcnKy9ffff1sbN27ktzpbDRs2tObMmWOtWbPGqlatmjioBoNct2TJEkuJg1w3cOBA68qVK7J9+PBhuZ7r9+rVS7bbt29vdezY0V+AwnrLvugqKSkpwo3bSEhIsBITE60xY8ZYly5dkuO62nXSrroxyPjYunWrtWjRIhkf27dvtw4cOCA+jBgxwuJrevToYfFYuHnzpvX+++9bw4YNC3WD99966y1L3YSkDo/FCRMmWEogxPbQoUNlXL700ktSj220atXKSk9PlzHGzJjh+fPnQza9vsH9Vf/0DS5dAFatWiWweZDahQP27bffhsRDqb6cCheP4cOHW2qubleRAXE/8VDzebmO22Lbfi23giy8orEdHx9v9enTR9rzAzO+kTCXtWvXypd/79691l9//WWp6ZjVtm3bkAsq05XrTpw48UDxUJmH1Pvxxx+lDt+cuBw9elTE9bfffpPjx44dk+MsJnyDW7p0qez74Q8z8+W0RQWQGjduTOpLrXz4f2nWrBmpzEN2+HiDBg3sU6HPZcuWSXpqH2jXrp29WexTBZIqVqwox3ha5PeFQTUYJRV3+pPXPOyiMg9SmQdlZGRI2m4f9/pn7969adCgQdSlSxdSmRTNmzePKleuLNPd8PHx2GOPiSs5OTl3uXT9+vVix9q0aSP7J0+eJJUBU1JSkuzXrVuXpkyZQkpEQvvytvly5ejcuXN0L9vFDHtsx5fi8eSTT9KpU6dkjsk8+Uuxb98+mW9G4suCwMJjF5533qvwFwElMoGsrCzip1S2aIwaNUoGP385wkU9shX3z/I6Bq/f8HoXC8fixYtp4cKF9NRTTxF/+e1iP4lr2rSpHOL1DbvYYmDvsyBwYeFQU2EqLCyUfZXR0BdffCHixAd4/KmsRP7t3LmTVMYm1/nljy/Fw74jzJ07VwLz008/CW9erIpUOnXqRF9//TWpdJF27dpF8+fPj3Q5zkUgoObpwt6vomG7tnz5cho8eLDs8peXF9PVmhp1796dfv75Z9q8ebOcU1NiUmsWkl3VqVOH1NqajKPdu3ff92meWiMRIVVrbyK0vFjP465FixZic8GCBRQXF0fr168ntQYi2Yec8NEfP0yx7uqjWuGWeSOvRyjWlrpryDW8gMrH7BK+5sFzWV734Ot5jskLYGrghBZMeZ2Er+fFWLuopzhyvb3vt0/2VUf59NNPZWH0frZ1tXu/9kp7nBc1Od7cXx43PCZyc3NlYXTAgAGh4zxeeCGVC6972HX4kxfUwxdMDx06FOrO7NmzxQbb50VSXojlojKc0HE+N3ny5FAdP2xwnzm/4r6qD/+VCxcuyOOzevXqheaVkbzgx7lVqlSR9RCen/Mdh9PQ9957L1I1X5/jFNqN+LrVbmmCVVBQIOsQVatWpRo1ahQzwVMNXvOqX7++ZAn2SbXISWfOnJH/Nsieptjn7vzk6d3FixfpkUceKXaKpyycBdesWZO4bT8V9tnX4lFS2DyfHT16NKnHb8TCw/N29YhOnsmX1JZfrnfrS+xWu36Ji9/7yfGN87sTJel/v3795CnKr7/+KkrPmQj/R0AoIAACJScQqMyj5Hj8X8OtDMCtdv0fMX94wPH15dMWf+BFL0HAbAIQD7PjC+9AQBsBiIc2tDAMAmYTgHiYHV94BwLaCEA8tKGFYRAwmwDEw+z4wjsQ0EYA4qENLQyDgNkEIB5mxxfegYA2AhAPbWhhGATMJgDxMDu+8A4EtBGAeGhDC8MgYDYBiIfZ8YV3IKCNAMRDG1oYBgGzCUA8zI4vvAMBbQQgHtrQwjAImE0A4mF2fOEdCGgjAPHQhhaGQcBsAhAPs+ML70BAGwGIhza0MAwCZhOAeJgdX3gHAtoIQDy0oYVhEDCbgLx6gX8JGQUEnCaAceU0UW/Zi/Ht6+JKwZHf/DVkyBB5i7ufXsZcCldRJcoEgviqiUBNW9T7QGnlypXEnyggAAJlIxCYzIOzjrS0NOL3kvJ7anNycuQN5mXDh9og8H8CyDwMHgmcbdgvfOZPZB8GBxuuRYVAIDKP8KzDporswyaBTycIIPNwgqIHbYRnHXb3kH3YJPAJAqUjYHzmwVlHamoqxcbGUlJSEuXl5cn+1atXqbCwkHJzc7H2Ubqxg1phBJB5hMEwZXP27NkiHFOnThWhYL/++ecfmjJlihzn8yggAAIlJ2B85nEnkiDeIe5kgH3nCQRxXAXqv/NwfsjAIggElwDEI7ixh+cgUCYCEI8y4UNlEAguAYhHcGMPz0GgTAQgHmXCh8ogEFwCEI/gxh6eg0CZCEA8yoQPlUEguAQgHsGNPTwHgTIRgHiUCR8qg0BwCUA8ght7eA4CZSIA8SgTPlQGgeASgHgEN/bwHATKRADiUSZ8qBxUApmZmVShQgXKysoqhoD3+TifN73g/6o1PcLwTwsB+3di4uLi5Hdi+HdhUlJSKD8/PzC/E4PMQ8vQglHTCfCrOzIyMqioqCj0OzH8Q1O8z8eD8GoPZB6mj3L4p41A0H8bF5mHtqEFw6YT4Oxi5MiRlJCQIK7yJ+8HIetgh5F5mD7C4Z9WAuHZR9B+kR+Zh9ahBeOmE7Czj/j4+EBlHRxXZB6mj274p50AZx9BfAcyxEP70ApmA/yDwChmE4gz2z145yYB+/WebvYBbeshwDcHrHnoYQurIGA8AYiH8SGGgyCghwDEQw9XWAUB4wlAPIwPMRwEAT0EIB56uMIqCBhPAOJhfIjhIAjoIQDx0MMVVkHAeAIQD+NDDAdBQA8BiIcerrAKAsYTgHgYH2I4CAJ6CEA89HCFVRAwngDEw/gQw0EQ0EMA4qGHK6yCgPEEIB7GhxgOgoAeAhAPPVxhFQSMJwDxMD7EcBAE9BCAeOjhCqsgYDwBiIfxIYaDIKCHAMRDD1dYBQHjCUA8jA8xHAQBPQQgHnq4wioIGE8A4mF8iOEgCOghAPHQwxVWQcB4AhAP40MMB0tD4ObNm1RYWFiaqoGpA/EITKjhaEkILFmyhDp16lSSKoG7FuIRuJDDYRBwhgDEwxmOsGIggfPnz9Nrr71GlSpVog4dOtDvv/8uXhYVFdGkSZOodu3aVL16dRo1ahTl5+cTH2/dujVlZ2dTkyZN5HrenzdvnuzXr1+f5s6daw4p9T7RQBUVuUD565azfue8aNEii30YOHCgtWLFCqt9+/ZWw4YNrRs3blizZ8+2kpOTrZkzZ1obNmywatWqZY0bN07OcR0+N2HCBOvMmTNig+utXr3aGjZsmOwroXErLI61y34G7pvk90HtWPQ1G/I7Z1s8Ll68KKT27t0rX/xDhw5ZrVq1ErGwEc6ZM0cEhIWF/VaZh5y6cuWK7K9bt072L126JPsHDx60q/r2k/3EtEVRQAGBexFo27atTFn4XOPGjeUSnsooAaFnn302VKVu3bp0+vTp0H6bNm1C27zB0xsuKiORz4KCAvn0+x+Ih98jiP5rI3Du3LmQ7ePHj8t2s2bNqGXLlsXE4vDhw/T888+Hro2JiQlt80ZsbGyxfVN2IB6mRBJ+OE7g6NGjtHz5crp8+TJ99tlnlJ6eTklJSdSzZ0+aP38+8fnr16+TmuLQCy+84Hj7XjcI8fB6hNA/1wjUq1eP3nzzTZm6LFiwgMaPHy996d+/P/HUg5+eJCYm0rVr10gtrIb6eWfmETpxa+NB5++83qv7Mbxi49XO6egXBy5gLuvA+ECbpnDm/9L02LFjVKdOHYqPjw/5zY9l+XhCQoKsaZgiCCEHH7DB/kI8HgAJp0tHwBTxKJ335tfi+GLaYn6c4SEIaCEA8dCCFUZBwHwCEA/zYwwPQUALAYiHFqwwCgLmE4B4mB9jeAgCWghAPLRghVEQMJ8AxMP8GMNDENBCAOKhBSuMgoD5BCAe5scYHoKAFgIQDy1YYRQEzCcA8TA/xvAQBLQQgHhowQqjIGA+AYiH+TGGhyCghQDEQwtWGAUB8wlAPMyPMTwEAS0EIB5asMIoCJhPAOJhfozhIQhoIQDx0IIVRkHAfAIQD/NjDA9BQAsBiIcWrDAKAuYTgHiYH2N4CAJaCEA8tGCFURAwnwDEw/wYw0MQ0EIgTotVGAUBRSBoL0IKWtAhHkGLeJT8Ddpb+YL4kitMW6L0ZUIzIGAaAYiHaRGFPyAQJQIQjyiBRjMgYBoBiIdpEYU/IBAlAhCPKIFGMyBgGgGIh2kRhT8gECUCEI8ogUYzIGAaAYiHaRGFPyAQJQIQjyiBRjMgYBoBiIdpEYU/IBAlAhCPKIFGMyBgGgGIh2kRhT8gECUCEI8ogUYzIGAaAYiHaRGFPyAQJQIQjyiBRjMgYBoBiIdpEYU/IBAlAhCPKIFGMyBgGgGIh2kRhT8gECUCEI8ogUYzIGAaAYiHaRGFPyAQJQIQjyiBRjNmEcjMzKQKFSpQVlZWMcd4n4/zedNLjPqVa8t0J8P9C+KvXIf7j21nCFy+fJlSU1MpLi6OkpKSKDc3l1JSUig/P58KCwtlPzk52ZnGPGoFmYdHA4NueZsAC0NGRgYVFRWJUHBv8/LyZJ+Pmy4c7C8yD6aAAgKlIMDZR1paGhUUFIRqJyYmUk5OTiDEA5lHKOzYAIGSEeDsYuTIkZSQkCAV+ZP3g5B1sMPIPEo2XnA1CBQjEJ59BCnrYAjIPIoNBeyAQMkI2NlHfHx8oLIOpoTMo2RjBVeDwF0EOPsYMmQIZWdnB2bKwhBi1L9APaq9K/IBOODG03h+JI5iNoE4ds+NwWU2Vu945+aXGOPKO+PA6Z7wuMKah9NUYQ8EAkIA4hGQQMNNEHCaAMTDaaKwBwIBIQDxCEig4SYIOE0A4uE0UdgDgYAQgHgEJNBwEwScJgDxcJoo7IFAQAhAPAISaLgJAk4TgHg4TRT2QCAgBCAeAQk03AQBpwlAPJwmCnsgEBACEI+ABBpugoDTBCAeThOFPRAICAGIR0ACDTdBwGkCEA+nicIeCASEAMQjIIGGmyDgNAGIh9NEYQ8EAkIA4hGQQMNNEHCaAMTDaaKwBwIBIQDxCEig4SYIOE0A4uE0UdgDgYAQgHgEJNBwEwScJgDxcJoo7IFAQAhAPAISaLgJAk4TME48Nm/eTNWrVxdOH374IQ0ePLjUzE6cOEHfffddqet7vSK/JjEzM9Pr3Yxa/8oyXgoKCuirr76iq1evRuxv+PicPHkyvfrqqxGv9/JJ48SD31KWn58vzAcNGkRjxowpNf99+/aVqX6pG9ZckUVj7NixlJqaSuPGjdPcmn/Ml2W8XLlyhYYNG0YXLlyI6HD4+OTtmzdvRrzeyyd9LR5Lly6lRo0aSabx7rvv0rVr14qxXrduHX3//fdy7OzZs9S/f3+5tmvXrrRnzx45vmPHDjk+ceJEql27NrVs2ZK2bdtGx44doxEjRtDRo0epb9++xez6dccWjbS0NJoxYwbFxcXR1KlT/eqO4/22xwuPo9atW9O8efOoSZMmVL9+fZo7d26ovWnTpsm44/EyadIkeV1rnz595Hy3bt0oJyeHdu/eLeOGs+AXX3yRNm3aFKpv0oYSQP+V/fv38wu6rc8//9xatWqV1bBhQ2vBggXWxo0breTkZHHogw8+sFRaaCl1t1q1amWlp6dba9assVQ2InXPnz8v+2ynV69est2+fXurY8eOlrqTWCqttKpVq2bt2rXLf4Bu9Zh9u3TpkvicmJhoJSQkiO98XGUe2vxi+34r9njh2HP/eUytXr3aUhmF7KuM1lI3FhkTW7dutRYtWiRjbfv27XId11m2bJmlpjBS94033rB27txpZWRkWI0bN5ZxGD4+lfBYAwcO9Bsm6S/7Ki+6Vhu+KwsXLiT1Jad33nlH+j5r1iw6efLkPf3gu4AKomQTjz/+OHXp0kXmp2vXrqXKlStLnW+++YYqVqxIhYWF1K9fP0pKSqKmTZvKsRYtWtzTrl8ODhkyhFauXEk3btwo1uXc3Fxy80XYxTrjwZ0vv/ySOnfuTO3atZMs5Pjx4zLGzp07J2sbnJEqUSDO5Bo0aCAetGnThpRA04QJE6h79+7C9+mnn5a1JV4XMan4dtrC04nmzZuHYvHcc8/R0KFDQ/vhG3wtl7p160owy5UrRzwAOL3korILEQnerlSpEnF6b1LJzs4mdfcjlXnIwLZ9S0lJkZRb3Uoc/7Tb8PMnT0u4qExWPvnL37t3b+K1Eb4BMT+e2tg3ILno1p+8vDx64oknZDyNHz8+/JQx274VD56Lnjp1KhQIzix++OGH0H74hh1cXvfghS3+x9fb81S+U5hcePBPmTJFxHLUqFEhEeGF5aysLJNdL5NvsbGxd9U/ffq0rBOxOLBwLF68mDgLDi9Hjhyht99+m6ZPny6L9/cbl+F1/LjtW/HglJAXuLZs2UKcfg8fPpwuXrx4zxjY0w61JiKLhOvXrye1BiLZxz0r3DrIGcq///4rU5lI1/nl3J0iwlO0sjyN8ovfTvZz+fLlocf/fPPhBXteYOWxwkWto8l45G3OhnlaOHPmTN719ZMVceCOP74VDxYEDl6HDh3o4Ycfppo1a9KAAQMkWOE+clD5PN8hRo8eLXddXv3mZ+ycvUQqzzzzjJx+0HWRbHjxnC0iLLr8tADlNgFbBG4fub3FQsBj7MCBAzJlqVKligjCK6+8QrytFttlnYzHYo8ePWRMli9fnh566CGZGr/++uvFxifbi9Te7Za9uRWjusWrp97s3X/oFX8BOL3k4D2o8HSFH8FycKtWrfqgy+U83505vbfnvf+pkocu4gHqRnzdajca6Hntg9fReAzVqFGjWJOcedhji6fVvC7C4sHZCf/7L+O0mEGP7nB8fS8eHmXrmW659SV2q13PgDe8Ixxf305bDI8N3AMBzxOAeHg+ROggCHiTAMTDm3FBr0DA8wQgHp4PEToIAt4kAPHwZlzQKxDwPAGIh+dDhA6CgDcJQDy8GRf0CgQ8TwDi4fkQoYMg4E0CEA9vxgW9AgHPE4B4eD5E6CAIeJMAxMObcUGvQMDzBCAeng8ROggC3iQA8fBmXNArEPA8AYiH50OEDoKANwlAPLwZF/QKBDxPAOLh+RChgyDgTQIQD2/GBb0CAc8TgHh4PkToIAh4kwDEw5txQa9AwPMEIB6eDxE6CALeJADx8GZc0CsQ8DwBiIfnQ4QOgoA3CUA8vBkX9AoEPE8gjnvI72BAAQGnCWBcOU3UW/b+B6JOhLdaibICAAAAAElFTkSuQmCC

[loader]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjsAAAF9CAYAAADiP6m3AAAFxnRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMnd3dy5kcmF3LmlvJTIyJTIwbW9kaWZpZWQlM0QlMjIyMDIwLTAyLTA2VDA4JTNBMTQlM0E1Ny41MjVaJTIyJTIwYWdlbnQlM0QlMjJNb3ppbGxhJTJGNS4wJTIwKE1hY2ludG9zaCUzQiUyMEludGVsJTIwTWFjJTIwT1MlMjBYJTIwMTBfMTRfNiklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkY3OC4wLjM5MDQuODclMjBTYWZhcmklMkY1MzcuMzYlMjIlMjBldGFnJTNEJTIyN1FVdnJmUHlFbFdTN0NQS1Biek4lMjIlMjB2ZXJzaW9uJTNEJTIyMTIuNi41JTIyJTIwdHlwZSUzRCUyMmRldmljZSUyMiUzRSUzQ2RpYWdyYW0lMjBpZCUzRCUyMlBQemdVUUh1cHhsMEdfdGF1TFZlJTIyJTIwbmFtZSUzRCUyMlBhZ2UtMSUyMiUzRTdWbFJiNXN3RVA0MWVWd1ZNQ0hrY1V2VDltR1RKa1ZxdTcxVWJuREFtOEdSTVFuWnI1OEJPMENkUk43VVlsTDFKZUklMkJiSVB2dSUyRnZ1VEVaZ25oUzNERzdpYnpSRVpPU093MklFcmtldU93T3UlMkJDMkJmUTFNQWxBREVjTmhEVGtOc01SJTJGa0FUSEVzMXhpTExPUUU0cDRYalRCVmMwVGRHS2R6RElHTjExaDYwcDZUNTFBeU9rQWNzVkpEcjZnRU1lMTJqZ1RodjhEdUVvVms5MiUyRkZsOUo0RnFzTnhKRnNPUTdsb1FXSXpBbkZISzY2dWttQ05TJTJCazc1cFo1M2MlMkJMdTRjVVlTcm5KaFBzb3VMM3p2OTlzbno0JTJGWVclMkZKZnJLSCUyQjAlMkJPWENiamU3VmpGQW9IU0pNeUh0T0lwcEFzR3ZRTG8za2Fvbkxac2JDYU1WOHAzUWpRRWVBdnhQbGVzZ2x6VGdVVTg0VEl1NmpBJTJGTEYxJTJGYU5jNm1vaXJldENybHdaZTJXa25PMGYyMFpyVm1rMjB5cEx6YXYzVjI3cXBOJTJCVUQyak9WdWljczJUOFFSWWhmbWFjZTJCWFpBV2lDUkx2SSUyQll4UkNESDIlMkI1N1FCbWYwV0ZjUTZHNGtDeiUyQkM2T3VUVWJIVjlOSmkxVG52VkFLckZKYXI3dUZKSmRQeXNRTGM0M25Mb3U3R0hPMDNNQnElMkZ6c2h6bDNHNUpxSWNWU2NkNk8lMkJiVFhCbDlJbXRkMVJVcmRybFBLQXhTMlZWUE5lM1ZPdTVpbWg1RVM0eExhcmdETTBWem5nUSUyRm1OWlFJWXlvUm5VeWFBRnZ5RXdoQ24wZUNpM3dYV285JTJGVG5NV1p1TEphT3R1VmMyeVlFazBXSE9wdFB5bmhHYWFFYjdWeVRqU2ExNUJrVm5tJTJCTU9rejVYbGlrMmM5bSUyRkc2ZElBNEFESmQlMkZXS2FQT2RaTDhybkJTJTJCVTcwamRENDRJWCUyRkJXd3FjblJFaFRQUiUyRjZyaEQlMkI0Q3FFcnpucVJEVDE3Q2x2Y0UyM291NmpiQnJJNmRSUVRtYzI1WFNxeFg2RzBHJTJGcm9mJTJGeXZPbDUxa00lMkZHRjUlMkZjV0VKRVJnbWhOMHZNRE9OWjl2SGhmOXJJd2RQczlVVHRKN05WUnQ1dkVQcXNZc0VvQ3Q4NEVoMzFHc1g2ZWpkMFVYcDNpc0c5c3d3c0U4dzNKTiUyQjZSWDlNdlhMMmpIWWxPYkFKczE2bGFyMDY5UTM4QjRWekFsNlV6QmhObiUyQnFWdmRhJTJGMHlEeFY4JTNEJTNDJTJGZGlhZ3JhbSUzRSUzQyUyRm14ZmlsZSUzRRvcgAMAACAASURBVHhe7Z0LvFZT+sefRMhEyUkzRU2FaEhTKfcQjU4Zl1TTRBkqYybpgjKnEl11U6gMI8a1MFK5lch9GEISMYRESSdKpRzO//Nb/m/znst7znvZe11/+/PpQ52917Oe7+/Za/3etdd+TxURKRYeXhMoLtYvcZUqVbxmyuREWFesgjgImKirOPJgm3YRwIxUzOKyS5QoewPTYUJfU3GjZMe2UhMwpa+puKwFPQSorx7OIUah2fFcdVODh6m4nstpTXqm9DUV1xrwnneE+nousMH0aHYMwtcR2tTgYSquDqaMIWJKX1NxqbkeAtRXD+cQo9DseK66qcHDVFzP5bQmPVP6moprDXjPO0J9PRfYYHo0Owbh6whtavAwFVcHU8bgyg5rIB4CHDfi4cpWRWh2PK8CU4OHqbiey2lNeqb0NRXXGvCed4T6ei6wwfRodgzC1xHa1OBhKq4OpozBlR3WQDwEOG7Ew5WtcmXH+xowNXiYiuu9oJYkaEpfU3Etwe59N6iv9xIbS5ArO8bQ6wlsavAwFVcPVUYxpa+puFRcDwHqq4dziFFodjxX3dTgYSqu53Jak54pfU3FtQa85x2hvp4LbDA9mh2D8HWENjV4mIqrgyljcM8OayAeAhw34uHKVrlnx/saMDV4mIrrvaCWJGhKX1NxLcHufTeor/cSG0uQKzvG0OsJbGrwMBVXD1VGMaWvqbhUXA8B6quHc4hRaHY8V93U4GEqrudyWpOeKX1NxbUGvOcdob6eC2wwPZodg/B1hDY1eJiKq4MpY3DPDmsgHgIcN+Lhyla5Z8f7GjA1eJiK672gliRoSl9TcS3B7n03qK/3EhtLkCs7xtDrCWxq8DAVVw9VRjGlr6m4VFwPAeqrh3OIUWh2PFfd1OBhKq7nclqTnil9TcW1BrznHaG+ngtsMD2aHYPwdYQ2NXiYiquDKWNwzw5rIB4CHDfi4cpWuWfH+xowNXiYiuu9oJYkaEpfU3Etwe59N6iv9xIbS5ArO8bQ6wlsavAwFVcPVUYxpa+puFRcDwHqq4dziFFodjxX3dTgYSqu53Jak54pfU3FtQa85x2hvp4LbDA9mh2D8HWENjV4mIqrgyljcM8OayAeAhw34uHKVrlnx/saMDV4mIrrvaCWJGhKX1NxLcHufTeor/cSG0uQKzvG0OsJbGrwMBVXD9XoohQVFcnuu+8eXYOaWjKlr6m4mrAGH4b6Bl8CsQHw2uw88sgjctRRR0njxo0zApjtdRkF0XRyXIPH5MmTpW/fvlKjRo1yM4krriZsaYV58cUX5bzzzpP169fL2LFj5b333pO77747rWtx0ooVK+TII4+U4uLitK+x5URT+pqKawt33/tBfX1X2Fx+Xpud5s2bS0FBgZx//vkZEc72uoyCaDo5rsFj7733lh9//FEGDx4s11xzTRnTE1dcTdjSCvPCCy9Ifn6+bN68WcaMGSMrV66Ue++9N61raXbSxlTixBDqKjsyflxFff3Q0cYsvDA7WImZPn26vPHGG3L22WfLzTffLBMnTpTRo0dL/fr1Zfbs2dK+fXsZN26c3HPPPYJHB5ikcA6OY489Vv785z/LpEmTpF27djJjxowS19koXLp9imvwmDZtmgwdOlR++uknQYyBAweWMD1xxU0372zOe+edd1QdLF++XNXH9ddfL02aNJFly5aplRuYm9atW8vVV18tJ554ovp7eWZn3bp1MmDAAFm6dKnAOE+YMEFatGihuvTQQw+pOqxataqceuqp6mdc2UlfLRfrKjm7VLXx5ptvKsPcpk0bNUbdeeedJf7+9ttvy/z582XYsGGyZs0aVTsY5xLj2+rVq2Xt2rXqkeitt96aPlDLznRdX8twsjtJBJw3O19//bXk5eXJ3LlzpVatWmqloVevXmoS6tixo/r/yy67TL788ktleP7+97+r87DaM2vWLOncubPsscceamViyJAh6ppu3brtuu6AAw5wumDiHDxq164thYWFik+1atVKmJ59993XqUn8+++/lwYNGkinTp2kd+/eygjXqVNHbr/9djnssMOUCe7Tp4888MAD8sQTT6hHUHiMVdrsYKLChFWzZk256qqrZMmSJTJ+/HjZtGmTfPvtt9KwYUO5/PLLpWXLlnLllVfKV1995RSnxM0QZ11VdMOZihvFIABTm6o2YLRPOukkOfTQQ1VdoOaS/37cccdJs2bN5IorrpDu3bsrI/7NN98oww0jjhXsDh06KCN+yimnRNFdI224rK8RYAyaNgHnzc5nn32mJqmbbrpJTVKYfLdv364Gi+THUdhPgQkHg83nn3+uzA4mqr/97W/K7GD1B9fj8O0xVtrVEMGJYHnWWWfJww8/7NQkDgMDo7t161apXr264JMyjDFWYWBw8DMMxI8++qhccMEFqsb+85//lDE7gwYNklatWqnrYWwwwdWtW1etFuJx14033ij4lI4Dn8z79+/vFCeanexvEqw8p6oNGGuYmw8//FCtJsLEJP8dj4qfffZZeeWVV1QH3n//fTn88MPl008/VfvEsLKND3S77bZb9h204EqaHQtE8LQLzpsd6ILNsliVwQEDM3XqVDnkkENKmBYs/cLYYGBIbKrFKlDC7GC/BQYPH81OXI9JsOq1ceNGL1Z2sPQ/ZcoUWbVqVZlbHUZl1KhRahWmUaNG8vHHH6c0O3iM2rVr1zJtzJw5U1566SW14gNjjuPVV1+Vtm3b0uxkMLi6PBk++OCDKWsDqzaJVULgSH5Eir9jtble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C2T79u0yefLkXWancePGctJJJykDVL16dVm1apW0atVKqlatqvb09OzZU7V14YUXqhWe6dOn58w/tJsptHxRID/99JP6s/vuu+dcL7Y34Ku+cRqdHTt2yI8//qjGHNeOOAyPTS+V+FTPIY1D6d5HXpqdGTNmyKhRo+Srr76SRo0ayccff1zG7CxZskR69OihzsGjrpEjR0qLFi2kXr16Zdh17dpV5syZky7TlOf5dDMhSZjHvn37So0aNcrN2YV8o960jsehWGG85557ZJ999pEPP/xQmjRpknPt2NiAC/qmU6fJbKM2Otdee6188skncuedd8o//vEPGThwoEyaNEndNy4eURkeEy+V+DBepVsziXHoX//6V7qXeH+ed2bno48+UpPLXXfdJTApH3zwgTRv3ryE2bnjjjvUCg/+HY+3brnlFpk3b55a3cGr6/Pnz5fTTjtNib9mzRq12hPFhOXK5JBu1WMzOD6lDh48WK655poypseFfKPetJ4YZB566CF58cUX1Wqhi5/i06kBF/RFHpXVaSLXqI0O2l29erVgNadp06ZyyimnyO9+9zu1h9DlIwrDY+KlksrqwJV6Tqd2aHbKUvLO7Lz22mvSpk0bWbt2rdSuXVv69+8vt912m2zdulWmTp2qTA7MTl5entx///3qy8GefvppOffcc2XdunXK5Bx88MFqHxA2P3fo0EHtB4rik5hPNxNKadq0aWqPE5ZMkRs+tSabHhfyTTY7+FqCyy67TN544w01OaFejj/+eHXX4HEoPhnCEJ9xxhkyfvx4tQqI3K+//nq57777pEGDBurfvv32W1Vb2DiPf0cd4dpmzZqpWqxTp44y2NhfBrOI1SWsBB1++OFqlRHmGlxtP1zQN506xTlxGB20i9UcjCu77babujew0jxx4kQ13iQfGLeGDBmi6gtjDmoP49fs2bOVYcJ4hkejqJnkv2MVe9y4cWq8wssVf/zjH9WLGNWqVRPsS/zzn/+sVpLwYe6QQw6JrKRyMTymXirxYbxKJWCqcQgrO6nGNdRcqnEJcbAaiTr87rvv1LYOzIMuP573wuwsXbpU7cvBKkxxcbH6zh3cjDiuuOIKNeG0b99eTTaJ79nBpmRMzph4sJ/nhhtukEsvvVR9Vw8M0Oeff66uxwZmPMLaY489ch4oXJkcMkkUA3JhYaG6BANssunZd999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
# Sprite

Sprite就是Model，良好的定義精靈能夠幫助前後端工程師上天堂。

## Methods

這次我們為員工的本質添加一筆資料`clock_on_list`，來了解該員工每天的打卡時間，並且為該員工建立一個打卡的`method`。

> 所有的method會被包在$fn的屬性內。

```js
let sprite = {
    body() {
        return {
            name: '',
            clock_on_list: []
        }
    },
    methods: {
        clockOn() {
            this.clock_on.push(Date.now())
        }
    }
}
```

我們建立一個會員Dave，並為他打上人生第一張卡，恭喜成為社畜Dave!

```js
let dave = oobe.make('company', 'staff').$born({
    name: 'Dave'
})
dave.$fn.clockOn()
console.log(dave.clock_on_list[0]) // 12345...
```

---

## Views

現在確實可以調閱Dave的打卡資料了，但這一串數字是什麼？老闆看不懂啊。

> view是專為視圖而生選項，基於`get`的模式建構。

```js
sprite = {
    views: {
        clock_on_list() {
            let list = this.clock_on_list.map(c => (new Date(c)).toISOString())
            return list.join(',')
        }
    }
}
console.log(staff.$views.clock_on_list) // 20xx-06-10T10:34:48.827Z
```

太好了，這下子老闆終於看懂了，才剛打卡？在混阿Dave。

---

## Watch

經過一番折騰，Dave終於可以上工了，他的工作是把所有的數值都轉成數字，為了觀察他的績效，我們幫他加上一組`產出(output)`屬性。

但Dave畢竟今天才上工，我們不能保證它能把工作做好，我們需要`watch`他。

```js
sprite = {
    body() {
        return {
            name: '',
            output: null,
            clock_on_list: []
        }
    },
    watch: {
        output(value) {
            console.log(value)
        }
    }
}
```

```js
dave.output = '1234' // log => '1234'
```

看吧，Dave產出的資料應該是數字而不是一組字串，因此我們需要協助改寫它。

> 當watch使用關鍵字`return`時，最後接收的值會以回傳值為主。

```js
sprite = {
    watch: {
        output(value) {
            return Number(value)
        }
    }
}
dave.output = '1234'
console.log(typeof dave.output) // number
```

### 機制

由於`oobe`採用的是`defineproperty`的`get`與`set`作為`watch`的機制，而非`proxy`，因此會有以下狀況發生：

```js
sprite = {
    body() {
        return {
            array: [],
            object: {
                demo: ''
            }
        }
    },
    watch: {
        array(value) {
            console.log(value)
        }
    }
}
// 這樣並不會有任何事件觸發
sprite.array.push('123')
sprite.object.demo = 5
// 底下會觸發console.log(5)
sprite.array = 5
```

對於array的watch，正在考慮是否要使用proxy的方法。

針對object的話，請使用`refs`。

## Refs

多層物件是難以避免的，把每個層級的物件都視為sprite是最好的實踐，接下來我們把Dave調往至某個單位。

```js
let body = () => { return { name: '' } }
let unit = {
    body,
    views: {
        detail() {
            return 'work unit is ' + this.name
        }
    }
}
let staff = {
    body,
    refs: {
        work_unit: 'unit' // work_unit指向unit sprite
    }
}
let company = {
    sprites: {
        unit,
        staff
    }
}
oobe.join('company', company)
let dave = oobe.make('company', 'staff').$born({
    name: 'Dave',
    work_unit: {
        name: 'Assembler'
    }
})
console.log(dave.work_unit.$views.detail)  // work unit is Assembler
```

## States

午休時間到，Dave是需要好好的休息了。

`states`定義了當下sprite的狀態。

> oobe 預設4個狀態，分別為read(預設)、create、update、dalete，如果需要擴充則需藉由Container定義。

```js
sprite = {
    body() {
        return {
            name: '',
            create_at: Date.now()
        }
    },
    states: {
        read: {
            fixed: '*',
            hidden: []
        },
        create: {
            hidden: ['create_at']
        },
        delete: {
            export() {
                return this.name
            }
        }
    }
}
```

## Fixed and Hidden

這兩個屬性並不會真正的做任何事，是為view而生的屬性，下面以`vue`做例子。

> 賦予`*`意味著永遠返回`true`

```html
<input v-show="dave.$show('name')" :disable="dave.$isFixed('name')">
```

## 切換狀態

使用`distortion`切換現有狀態。

> refs的sprite會隨著主sprite變換狀態

```js
dave.$isFixed('name') // true
dave.$distortion('create')
dave.$isFixed('name') // false
dave.$distortion('delete')
dave.$export() // Dave
```

---


## 生命週期

![life_cycle][life_cycle]

### Born 與 Origin

人資希望了解更多Dave的事，希望Dave填入喜愛的食物。

```js
let staff = {
    body() {
        return {
            name: '',
            favorite_food: null
        }
    }
}
```

Dave給我們的答案是`北部粽`，由於資料庫中沒有`北部粽`這個選擇，所以我們必須攔截成正常人比較所知的資料。

> born是接收資料的接口，只能宣告一次，在宣告前有大部分的功能是無法使用的。

```js
let born = function(data) {
    let favorite_food = data.favorite_food
    if (favorite_food === '北部粽') {
        favorite_food = '3D油飯'
    }
    return {
        name: data.name,
        favorite_food
    }
}

let staff = {
    born,
    body() {
        return {
            name: '',
            favorite_food: null
        }
    }
}
```

但當Dave想要校閱基本資料時我們仍必須提供當初輸入的文字：

```js
let origin = function() {
    let favorite_food = this.favorite_food
    if (favorite_food === '3D油飯') {
        favorite_food = '北部粽'
    }
    return {
        name: this.name,
        favorite_food 
    }
}

let staff = {
    born,
    origin,
    body() {
        return {
            name: '',
            favorite_food: null
        }
    }
}
```

```js
let dave = oobe.make('company', 'staff').$born({
    name: 'Dave',
    favorite_food: '北部粽'
})
let origin = dave.$toOrigin()
console.log(dave.favorite_food) // 3D油飯
console.log(origin.favorite_food) // 北部粽
```

### Out 與 Revive

對於表單操作上，我們必須避免資料在存檔前被更動，但在雙向綁定的架構上很難避免此狀況發生，這時可以採用`out`來複製一份`sprite`，待確定更動目標後再宣告`revive`把資料複寫回本體。

```js
let outDave = dave.$out()
// 報錯，本尊dave已經靈魂出竅死去了。
dave.name = 'James'
// 把Dave更換成James。
outDave.name = 'James'
outDave.$revive()
// 報錯，本尊dave已經復活。
outDave.name = 'Bob'
console.log(dave.name) // James
```

但Dave就不是James阿，沒問題，我們可以使用`reset`回復原始資料。

```js
dave.$reset()
console.log(dave.name) // Dave
```

不過等資料輸出在reset是個很愚蠢的行為，可以利用`dead`來放棄這次的變更。

```js
let outDave = dave.$out()
outDave.name = 'James'
outDave.$dead()
console.log(dave.name) // Dave
```

---

## 總結

恭喜下班，Dave辛苦了，我們來看看Staff這個sprite最終呈現的模樣。

```js
let unit = {
    body,
    views: {
        detail() {
            return 'work unit is ' + this.name
        }
    }
}
let staff = {
    body() {
        return {
            name: '',
            output: null,
            create_at: Date.now(),
            favorite_food: '',
            clock_on_list: []
        }
    },
    refs: {
        work_unit: 'unit'
    },
    methods: {
        clockOn() {
            this.clock_on.push(Date.now())
        }
    },
    watch: {
        output(value) {
            return Number(value)
        }
    },
    views: {
        clock_on_list() {
            let list = this.clock_on_list.map(c => (new Date(c)).toISOString())
            return list.join(',')
        }
    },
    born(data) {
        let favorite_food = data.favorite_food
        if (favorite_food === '北部粽') {
            favorite_food = '3D油飯'
        }
        return {
            name: data.name,
            favorite_food
        }
    },
    origin() {
        let favorite_food = this.favorite_food
        if (favorite_food === '3D油飯') {
            favorite_food = '北部粽'
        }
        return {
            name: this.name,
            favorite_food 
        }
    },
    states: {
        read: {
            fixed: '*',
            hidden: []
        },
        create: {
            hidden: ['create_at']
        },
        delete: {
            export() {
                return this.name
            }
        }
    }
}
```
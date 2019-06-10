# Sprite

良好的定義精靈能夠幫助前後端工程師上天堂，如何開始？

我們一樣用員工系統做舉例。

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
let staff = oobe.make('company', 'staff').$born({
    name: 'Dave'
})
staff.$fn.clockOn()
console.log(staff.clock_on_list[0]) // 12345...
```

---

## Views

現在確實可以調閱Dave的打卡資料了，但這一串數字是什麼？老闆看不懂啊。

> view是專為視圖而生選項，基於`get`的模式建構。

```js
sprite = {
    ...sprite,
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
    ...sprite,
    body() {
        return {
            name: '',
            output: [],
            clock_on_list: []
        }
    },
    watch: {
        output() {
            
        }
    }
}
```
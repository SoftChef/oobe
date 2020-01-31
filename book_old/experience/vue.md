# 前言

`oobe`原本是定義在前後端都能使用的model system，但最後還是決定主力在前端了，畢竟後端有一個目標為非同步加載的model實在是太恐怖惹，怎麼死的都不知道。

> 但oobe並沒有跟DOM互動，且未來開發都會允許在server端正常運行，心臟大顆的朋友們可以試試。

在接下來的實戰演練中，你必須具備ES6以上版本的基本常識，我會以前端工程師的角度說明，並使用vue開發作為例子，畢竟oobe是在vue環境中誕生的，如果是使用其他框架的朋友願意使用也可以一起參與開發。

## 糟糕的一天 :(

一大清早，你洗了洗臉，在辦公室門口呼吸最後一口新鮮空氣，走進了公司內。

PM看到你高興地揮手，並告知你「商業邏輯有改變。」

你微笑點頭致意，回到自己的座位上並點擊螢幕上的編輯器，呆望這你那趕著交差寫出來的程式碼，落下了兩行淚。

### 改變的原因

原因其實不複雜，主要是下列的資料需要變動，下列是後端回傳的資料結構：

```js
{
    "Username": String,
    "UserAttributes": [
        {
            "Name": "PhoneNumber",
            "Value": String
        }
    ]
}
```

你可能是在一間外送服務公司上班，而這是一張記錄外送員的表所撈取出來的資料，由於公司計畫將API交給其他部門串接，使得後端不得不把Username這個欄位修改成Dirver。

此時看看你手上的程式碼：

```html
<!--create.vue-->
<template>
    <div>
        <input v-model="username">
        <input v-model="phoneNumber">
        <button @click.stop="submit">送出</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            phoneNumber: ''
        }
    },
    methods: {
        submit() {
            axios.post('createUser', {
                Username: this.username,
                UserAttributes: [
                    {
                        Name: "PhoneNumber",
                        Value: this.phoneNumber
                    }
                ]
            })
        }
    }
}
</script>
```

```html
<!-- overview.vue -->
<template>
    <div>
        <div>司機: {% raw %}{{ username }}{% endraw %}</div>
        <div>連絡電話: {% raw %}{{ phoneNumber }}{% endraw %}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            phoneNumber: ''
        }
    },
    mounted() {
        axios.get('getUser').then((result) => {
            this.username = result.Username
            for (let attr of result.UserAttributes) {
                if (attr.Name === 'PhoneNumber') {
                    this.phoneNumber = attr.Value
                }
            }
        })
    }
}
</script>
```

你大致上能知道需要更動的檔案就有兩支以上，還有大小寫命名上的差異，有夠你受的了，你得打開全域搜尋，小心翼翼的覆蓋每個命名，然後等待上版後死在原因不明的地方，這意味著，你需要`model`。

### 把時空拉回寫這段程式碼之前

突然間，你從辦公桌上驚醒，原來那只是一場惡夢，但令人意外的是，那是場預知夢。

很快的主管召集你，要你建立一個前端完整的外送人員CRUD的流程，但目前還沒有改動Username的需求，為了不再犯下同樣的過錯，你上網搜尋了model，然後找到了oobe。

你飛快地將資料夾結構定義如下：

```bash
├── index.html
├── main.js
├── oobe
│   ├── index.js
│   └── user
│       ├── index.js # container
│       ├── user.js # sprite
│       └── attributes.js # sprite
├── pages
│   └── user
│       └── create.vue
└── components
    └── form.vue
```

```js
// oobe/index.js
import Vue from 'vue'
import Oobe from 'oobe'
import ob from 'oobe/packages/ob'
import user from './user/index.js'

let oobe = new Oobe()
    oobe.addon(ob)
    oobe.join('user', user)

Vue.prototype.$oobe = oobe

export default oobe
```

```js
// oobe/user/index.js
import user from './user.js'
import attributes from './attributes.js'

export default {
    sprites: {
        user,
        attributes
    }
}
```

```js
// oobe/user/user.js
export default {
    body() {
        return {
            username: ''
        }
    },
    refs: {
        attributes: 'attributes'
    },
    born(source = {}) {
        return {
            username: source.Username,
            attributes: source.UserAttributes
        }
    },
    origin() {
        return {
            Username: this.username,
            UserAttributes: this.attributes.$toOrigin()
        }
    }
}
```


```js
// oobe/user/attributes.js
export default {
    body() {
        return {
            phoneNumber: ''
        }
    },
    born(source = []) {
        let output = {}
        for (let { Name, Value } of result.UserAttributes) {
            if (Name === 'PhoneNumber') {
                output.phoneNumber = Value
            }
        }
        return output
    },
    origin() {
        return [
            {
                Name: "PhoneNumber",
                Value: this.phoneNumber
            }
        ]
    }
}
```

我們已經成功把該屬於model的邏輯給抽離出來，接下來處理vue :

```html
<!--create.vue-->
<template>
    <div>
        <input v-model="user.username">
        <input v-model="user.attributes.phoneNumber">
        <button @click.stop="submit">送出</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: this.$oobe.make('user', 'user').$born()
        }
    },
    methods: {
        submit() {
            axios.post('createUser', this.user.$toOrigin())
        }
    }
}
</script>
```

```html
<!-- overview.vue -->
<template>
    <div>
        <div>司機: {% raw %}{{ user.username }}{% endraw %}</div>
        <div>連絡電話: {% raw %}{{ user.attributes.phoneNumber }}{% endraw %}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: this.$oobe.make('user', 'user')
        }
    },
    mounted() {
        axios.get('getUser').then(result => this.user.$born(result))
    }
}
</script>
```

此時的vue再也不需要在乎後端的商業邏輯，只需要專注在互動與介面上的操作，與資料打交道交給oobe就行了。

## 回到資料變更

預知夢完美的呈現了，你痛恨著自己沒有抄下所有的大樂透號碼，但沒關係，至少你還用了oobe O_<

```js
// oobe/user/user.js
export default {
    body() {
        return {
            username: ''
        }
    },
    refs: {
        attributes: 'attributes'
    },
    born(source = {}) {
        return {
            username: source.Dirver, // 把Username修改成Dirver，確保前端的介面統一
            attributes: source.UserAttributes
        }
    },
    origin() {
        return {
            Dirver: this.username,
            UserAttributes: this.attributes.$toOrigin()
        }
    }
}
```

## 雲端服務

基本上，上述並不算是一個好例子，這種嚴重的商業邏輯失誤你務必得修改全部的Key才不會造成不必要的維護困難，oobe主要面向的還是資料結構轉換上的困難，當我們使用雲端服務的時候，直接使用供應商寫好的SDK時是不需要後端的支援的，但也造成回傳資料的結構不是很符合預期。

# 前言

`oobe`原本是定義在前後端都能使用的model system，但最後還是決定主力在前端了，畢竟後端有一個目標為非同步加載的model實在是太恐怖惹，怎麼死的都不知道。

> 但oobe並沒有跟DOM互動，且未來開發都會允許在server端正常運行，心臟大顆的同學們可以試試，也可以說說你的經歷來給我們笑笑。

在接下來的實戰演練中，你必須具備ES6以上版本的基本常識，我會以前端工程師的角度說明，並使用vue開發作為例子，畢竟oobe是在vue環境中誕生的，如果是使用其他框架的朋友願意使用也可以一起參與開發。

## 雲端服務

`oobe`成形的主因跟cloud service脫離不了關係，從他們的API所獲取的資料格式可以讓我們清楚的知道他們內部山頭林立，各大派系誰也不讓誰，不過沒關係，我們碼農可是整地界的翹楚。

接下來，我們把後端工程師視為用香蕉請來的猴子，他建立了一支建立User的API，需要的格式如下：

### User的資料結構

```json
{
    "Username": "巨槌瑞斯",
    "UserAttributes": [
        {
            "Name": "id",
            "Value": "AAAAAA-AAAAAA-AAAAAA-AAAAAA-AAAAAA"
        },
        {
            "Name": "phone_number",
            "Value": "+886000000000"
        }
    ]
}
```

## 準備好你的武器

### 資料結構範例：

```bash
├── index.html
├── main.js
├── oobe
│   ├── index.js
│   └── user
│       ├── index.js # container
│       ├── user.js # sprite
│       └── user_attributes.js # sprite
├── pages
│   └── user
│       └── create.vue
└── components
    └── form.vue
```

## 定義好oobe

### oobe/index.js

```js
import user from './user/index.js'

let oobe = new Oobe()
    oobe.join('user', user)

Vue.prototype.$oobe = oobe
```

### oobe/user/index.js

```js
import user from './user.js'
import userAttributes from './userAttributes.js'
export default {
    sprties: {
        user,
        userAttributes
    }
}
```

### oobe/user/user.js

```js
export default {
    body() {
        return {
            username: ''
        }
    },
    refs: {
        attributes: 'userAttributes'
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
    },
    states: {
        read: {
            fixed: '*'
        },
        create: {
            export() {
                return {
                    Username: this.username
                    UserAttributes: this.attributes.$toOrigin()
                }
            }
        }
    }
}
```

### oobe/user/user_attributes.js

```js
export default {
    body() {
        return {
            phoneNumber: ''
        }
    },
    born(source = []) {
        let output = {}
        for (let { Name: name, Value: value } of source) {
            if (name === 'phone_number') {
                output.phoneNumber = value
            }
        }
        return output
    },
    origin() {
        return [
            {
                "Name": "phone_number",
                "Value": this.phoneNumber
            }
        ]
    }
}
```

## 定義Components

現在開始用oobe，能夠讓你改寫Vue時少痛些。

下列的例子可得知，如果我們要把原始資料直接寫vue非常痛苦，閱讀性非常不好，所以我們把資料處裡交給oobe，讓vue file只需要針對body做處理。

> 因此，如果你是一位切版，讓你應該引入oobe，讓你有更好的理由把鍋甩給前端工程師。

### components/form.vue

```html
<template>
    <div>
        <!-- username -->
        <div v-show="sprite.$show('username')">
            <div>username</div>
            <input v-model="sprite.username" type="text" :disabled="sprite.$isFixed('username')">
        </div>
        <!-- email -->
        <div v-show="sprite.attributes.$show('email')">
            <div>email</div>
            <input v-model="sprite.attributes.email" type="text" :disabled="sprite.attributes.$isFixed('email')">
        </div>
        <!-- phone number -->
        <div v-show="sprite.attributes.$show('phoneNumber')">
            <div>phone number</div>
            <input v-model="sprite.attributes.phoneNumber" type="text" :disabled="sprite.attributes.$isFixed('phoneNumber')">
        </div>
    </div>
<template>
<script>
    module.exports = {
        props: ['sprite'],
        mounted() {
            if (this.$oobe.instanceof('user', 'user', this.sprite) === false) {
                throw new Error('Sprite instance not a user sprite.')
            }
        }
    }
</script>
```

### pages/create.vue

```html
<template>
    <div>
        <user-form :sprite="sprite"></user-form>
        <button type="button" :click="submit()"></button>
    </div>
<template>
<script>
    module.exports = {
        data() {
            return {
                sprite: this.$oobe.make('user', 'user').$born().$dist('create')
            }
        },
        methods: {
            submit() {
                axios.post('./createUser', this.sprite.$export('create'))
            }
        }
    }
</script>
```

## 下面開始oobe的技術總結

上述建立了一個最陽春的架構，大致上建立了最基本的模式，這一階段至少達成每一位接手的前端開發人員可以直接參考sprite file，而不是通靈，當然也不只如此，完整案例如下：

[Example Website](https://softchef.github.io/oobe/example/)

[Example Website Code](https://github.com/SoftChef/oobe/tree/master/example)

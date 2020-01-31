# 前言

`oobe`最初的目的就是簡化表單處理。

延上一章，CRUD中我們有兩張表單，分別是create和update，通常我們會把表單抽出作為component，但基本上這兩張表單處理的狀態是不一樣的，也就是我們必須將模式給分離。

比如說在update的狀態下，username是不能被改寫的：

```html
<!-- form.vue -->
<template>
    <div>
        <input v-model="user.username" :disabled="mode === 'update'">
        <input v-model="user.attributes.phoneNumber">
    </div>
</template>

<script>
export default {
    props: ['user', 'mode']
}
</script>
```

這種寫法除非有一個主要控管程式品質的前端的工程師，否則每個人處理的方式都截然不同，且嚴謹性非常低，如果使用oobe則會呈現如下：

```html
<!-- userform.vue -->
<template>
    <div>
        <input
            v-model="user.username"
            v-show="user.$show('username')"
            :disabled="user.$isFixed('username')">
        <input
            v-model="user.attributes.phoneNumber"
            v-show="user.attributes.$show('phoneNumber')"
            :disabled="user.attributes.$isFixed('phoneNumber')">
    </div>
</template>

<script>
export default {
    props: ['user'],
    mounted() {
        // instanceof 會研判你傳入的精靈是否符合預期
        if (this.$oobe.instanceof('user', 'user', this.user) === false) {
            throw new Error('Sprite not a user instance.')
        }
    }
}
</script>
```

這看起來是有點白癡，我們把所有的可能性都轉移到了oobe上定義了。

## 控制畸變(distortion)

distortion類似一種狀態，但是否切換完全是主動的，讓我們繼續定義user.js。

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
    },
    dists: {
        create: {
            export() {
                return this.$toOrigin()
            }
        },
        update: {
            fixed: ['username'],
            export() {
                let origin = this.$toOrigin()
                delete origin.Username
                return origin
            }
        }
    }
}
```

回到create的vue file，我們引入form component。

```html
<!--create.vue-->
<template>
    <div>
        <userform :user="user"></userform>
        <button @click.stop="submit">送出</button>
    </div>
</template>

<script>
import Form from './userform.vue'
export default {
    data() {
        return {
            user: this.$oobe.make('user', 'user').$born().$dist('create')
        }
    },
    components: {
        userform: Form
    },
    methods: {
        submit() {
            axios.post('createUser', this.user.$export())
        }
    }
}
</script>
```

聰明如你應該發現了我們建立user精靈後還呼叫了$dist，這意味著該精靈是位於create的模式。

接下來是Update：

```html
<!--update.vue-->
<template>
    <div>
        <!-- 在宣告$born後ready會宣告成true -->
        <div v-if="user.$ready">
            <userform :user="user"></userform>
            <button @click.stop="submit">送出</button>
        </div>
        <div>
            Loading...
        </div>
    </div>
</template>

<script>
import Form from './userform.vue'
export default {
    data() {
        return {
            user: this.$oobe.make('user', 'user').$dist('update')
        }
    },
    components: {
        userform: Form
    },
    mounted() {
        axios.get('getUser').then(result => this.user.$born(result))
    },
    methods: {
        submit() {
            axios.post('updateUser', this.user.$export())
        }
    }
}
</script>
```

接下來所有狀態的定義只需要從oobe file中做更動，就可以成功符合表單需求。

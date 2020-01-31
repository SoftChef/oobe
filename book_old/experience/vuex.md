# Vuex

多數的資料交換期望透過store處理已經是現在的共識，意味著oobe必須和狀態管理的模組打交道，Vuex是vue官方團隊推薦的狀態管理工具。

我們試著把oobe加入Vuex Store的原型中：

```js
// oobe/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import Oobe from 'oobe'
import ob from 'oobe/packages/ob'
import user from './user/index.js'

let oobe = new Oobe()
    oobe.addon(ob)
    oobe.join('user', user)

Vue.prototype.$oobe = oobe
Vuex.Store.prototype.$oobe = oobe

export default oobe
```

在上一篇我們介紹了update.vue中我們把請求放在vue component內，這可以說是自殺行為，不過沒關係，還來的及。

```js
// store.js
import Vuex from 'vuex'
export default new Vuex.Store({
    state: {
        user: null
    },
    actions: {
        fetch({ commit }, key) {
            commit('make')
            axios
                .get('getUser')
                .then(reslut => commit('born', reslut))
                .catch(error => commit('error', error))
        },
        update({ state }) {
            axios.post('updateUser', state.user.$export())
        }
    },
    mutations: {
        make(state) {
            state.user = this.oobe.make('user', 'user')
        },
        born(state, data) {
            state.user.$born(data)
        },
        error(state, error) {
            state.user.$setError(error)
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    }
})
```

接下來我們調整update.vue：

```html
<!--update.vue-->
<template>
    <div v-if="user">
        <div v-if="user.$error">
            ERROR : {% raw %}{{ user.$error }}{% endraw %}
        </div>
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
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    components: {
        userform: Form
    },
    mounted() {
        this.fetch()
        this.user.$dist('update')
    },
    methods: {
        ...mapActions({
            fetch: 'fetch',
            update: 'update'
        }),
        submit() {
            this.update()
        }
    }
}
</script>
```

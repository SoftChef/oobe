# List

## 使用collecntion

Collection即是為List view而生，我們對user的sprite定義collection屬性：

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
    },
    collection: {
        key: sprite => sprite.username
    }
}
```

## 為vuex加入collection

```js
// store.js
import Vuex from 'vuex'
export default new Vuex.Store({
    state: {
        user: null,
        collection: null
    },
    actions: {
        fetch({ commit }) {
            commit('make')
            axios
                .get('getUser')
                .then(reslut => commit('born', reslut))
                .catch(error => commit('error', error))
        },
        fetchCollection({ commit, state }) {
            if (state.collection == null) {
                commit('initCollection')
            }
            axios
                .get('getUsers')
                .then(reslut => commit('collection', reslut))
        },
        update({ state }) {
            axios.post('updateUser', state.user.$export())
        }
    },
    mutations: {
        make(state) {
            state.user = oobe.make('user', 'user')
        },
        born(state, data) {
            state.user.$born(data)
        },
        error(state, error) {
            state.user.$setError(error)
        },
        initCollection(state) {
            state.collection = this.$oobe.collection('user', 'user')
        }
        collection(state, users) {
            state.collection.batchWrite(users)
        }
    },
    getters: {
        user(state) {
            return state.user
        },
        collection(state) {
            return state.collection
        }
    }
})
```

## 全新的list.vue

```html
<template>
    <table v-if="collection">
        <thead>
            <tr>
                <th>使用者名稱</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in collection.items" :key="'key' + index">
                <td>{{ item.username }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            collection: 'collection'
        })
    },
    mounted() {
        this.fetch()
    },
    methods: {
        ...mapActions({
            fetch: 'fetch'
        })
    }
}
</script>
```

## 關聯資料

有時候我們有些資料並不會一起被送過來，而是反覆請求拿回細節，例如說我們在列表呈現的時候要順便顯示外送地點，但這不是getUser這支API會回給我們的資料，而是getToTarget，這支API需要username來發請求。

我們來修改list.vue：

> 基本上target也是由vuex控制，但這裡偷懶一下。

```html
<template>
    <table v-if="collection">
        <thead>
            <tr>
                <th>使用者名稱</th>
                <th>外送地點</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in collection.items" :key="'key' + index">
                <td>{{ item.username }}</td>
                <td>{{ targets[item.username] || 'loading...' }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    data() {
        return {
            targets: {}
        }
    },
    computed: {
        ...mapGetters({
            collection: 'collection'
        })
    },
    mounted() {
        this.fetch()
        // 在這裡監聽是否有寫入的精靈
        this.collection.$on('$writeSuccess', (context, { sprite }) => {
            let username = sprite.username
            axios
                .get('getToTarget', { params: { username } })
                .then((target) => {
                    this.targets[username] = target
                })
        })
    },
    methods: {
        ...mapActions({
            fetch: 'fetch'
        })
    }
}
</script>
```

實戰大致上就到這裡，但oobe還有很多有趣的應用，例如rules的模式就是為了vuetify而打造的，而views其實是list的主力，在研判當下狀態應該顯示什麼是非常重要的。

所以如果想知道更細節的建構模型，可以前往我們提供的範例程式碼：

[Example Website](https://softchef.github.io/oobe/example/)

[Example Website Code](https://github.com/SoftChef/oobe/tree/master/example)

import oobe from './oobe/index.js'
import i18n from './messages.js'
import store from './store.js'
import router from './router.js'
import loader from './lib/vue-http-loader/index.js'

loader.addComponentFileFor('./components/', {
    'app-nav': 'nav.vue'
})

loader.addComponentFileFor('./components/commodity/', {
    'commodity-form': 'form.vue',
    'commodity-list': 'list.vue',
    'commodity-read': 'read.vue',
    'commodity-create': 'create.vue',
    'commodity-update': 'update.vue'
})

loader.onload((components) => {
    Vue.prototype.$oobe = oobe
    Vue.mixin({
        methods: {
            push(data) {
                this.$router.push(data)
            }
        }
    })
    for (var key in components) {
        Vue.component(key, components[key])
    }
    window.system = new Vue({
        i18n,
        store,
        router: router(components),
        el: '#app'
    })
})

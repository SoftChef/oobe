import Vue from 'vue'
import Vuetify from 'vuetify'

import main from './components/App.vue'
import i18n from './i18n'
import store from './store'
import router from './router'

import Header from './components/Header.vue'
import Navigation from './components/Navigation.vue'

import './oobe/index'
import './stylus/main.styl'

Vue.use(Vuetify)
Vue.component('app-header', Header)
Vue.component('app-navigation', Navigation)

new Vue({
    router,
    store,
    i18n,
    el: '#app',
    render: h => h(main)
})

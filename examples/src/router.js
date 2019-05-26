import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Update from './components/Form/Update.vue'
import Create from './components/Form/Create.vue'
import Overview from './components/Form/Overview.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/index.html',
            redirect: '/'
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/create',
            name: 'create',
            component: Create
        },
        {
            path: '/overview',
            name: 'overview',
            component: Overview
        },
        {
            path: '/update',
            name: 'update',
            component: Update
        }
    ]
})

export default router

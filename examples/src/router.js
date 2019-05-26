import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import ErrorPage from './components/404.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            component: ErrorPage
        },
        {
            path: '/index.html',
            redirect: '/'
        },
        {
            path: '/',
            name: 'home',
            component: Home
        }
    ]
})

export default router

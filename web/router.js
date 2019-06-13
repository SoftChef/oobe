export default function(components) {
    return new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '*',
                redirect: '/'
            },
            {
                name: 'home',
                path: '/',
                component: components['app-main']
            },
            {
                path: 'commodity',
                name: 'commodity.list',
                component: components['commodity-list']
            },
            {
                path: 'commodityCreate',
                name: 'commodity.create',
                component: components['commodity-create']
            },
            {
                path: 'commodityOverview',
                name: 'commodity.overview',
                component: components['commodity-read']
            },
            {
                path: 'commodityUpdate',
                name: 'commodity.update',
                component: components['commodity-update']
            }
        ]
    })
}

export default function(components) {
    return new VueRouter({
        mode: 'history',
        base: '/oobe/example',
        routes: [
            {
                path: '*',
                redirect: '/'
            },
            {
                path: '/',
                name: 'commodity.list',
                component: components['commodity-list']
            },
            {
                path: '/create',
                name: 'commodity.create',
                component: components['commodity-create']
            },
            {
                path: '/overview',
                name: 'commodity.overview',
                component: components['commodity-read']
            },
            {
                path: '/update',
                name: 'commodity.update',
                component: components['commodity-update']
            }
        ]
    })
}

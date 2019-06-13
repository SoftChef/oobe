export default new Vuex.Store({
    state: {
        items: [],
        count: 0
    },
    actions: {
        first(context, no) {
            let id = Number(no)
            return context.state.items.find(i => i.no === id)
        },
        create(context, sprtie) {
            context.state.count += 1
            context.state.items.push(sprtie)
        }
    },
    mutations: {}
})

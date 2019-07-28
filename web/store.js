import oobe from './oobe/index.js'
import ajax from './fakeRequest.js'

export default new Vuex.Store({
    state: {
        collection: null
    },
    actions: {
        fetch({ commit, dispatch }, key) {
            return ajax.get(key)
        },
        fetchList({ dispatch }) {
            ajax.list()
                .then((result) => {
                    dispatch('writeCollection', result)
                })
        },
        create(context, data) {
            return ajax.create(data)
        },
        update(context, data) {
            return ajax.update(data)
        },
        remove({ commit, dispatch }, key) {
            commit('destroyed')
            ajax.remove(key).then(() => {
                dispatch('fetchList')
            })
        },
        writeCollection({ commit, state, dispatch }, item) {
            if (state.collection == null) {
                state.collection = oobe.collection('shop', 'commodity')
            }
            commit('write', item)
        }
    },
    mutations: {
        write(state, item) {
            state.collection.batchWrite(Array.isArray(item) ? item : [item])
        },
        destroyed(state) {
            state.collection = null
        }
    },
    getters: {
        list(state) {
            return state.collection ? state.collection.list() : null
        }
    }
})

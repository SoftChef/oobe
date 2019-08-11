import oobe from './oobe/index.js'
import ajax from './monkey_request.js'

export default new Vuex.Store({
    state: {
        error: null,
        sprite: null,
        collection: null
    },
    actions: {
        fetch({ commit }, key) {
            commit('make')
            ajax.get(key)
                .then(reslut => commit('born', reslut))
                .catch(error => commit('error', error))
        },
        fetchList({ commit }) {
            ajax.list()
                .then((result) => {
                    commit('list', result)
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
            ajax.remove(key)
                .then(() => {
                    dispatch('fetchList')
                })
        }
    },
    mutations: {
        list(state, items) {
            if (state.collection == null) {
                state.collection = oobe.collection('shop', 'commodity')
            }
            state.error = null
            state.collection.batchWrite(items)
        },
        make(state) {
            state.error = null
            state.sprite = oobe.make('shop', 'commodity')
        },
        born(state, data) {
            state.sprite.$born(data)
        },
        error(state, error) {
            state.error = error.message
        },
        destroyed(state) {
            state.error = null
            state.sprite = null
            state.collection = null
        }
    },
    getters: {
        list(state) {
            return state.collection ? state.collection.list() : null
        },
        sprite(state) {
            return state.sprite
        },
        error(state) {
            return state.error
        }
    }
})

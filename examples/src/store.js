import vue from 'vue'
import vuex from 'vuex'
import oobe from './oobe'

vue.use(vuex)

export default new vuex.Store({
    state: {
        users: []
    },
    actions: {
        addUser({ state }, data) {
            state.users.push(oobe.make('User', 'user', data))
        }
    }
})

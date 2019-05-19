const user = require('./sprites/user')
const locale = require('./locale')
const attributes = require('./sprites/attributes')

/**
 * @name cognito_user
 * @description cognito user
 */

module.exports = {
    sprites: {
        user,
        attributes
    },

    locale,

    install(configs, options) {},

    utils: {},

    configs: {},

    methods: {},

    states: [],

    rules: {
        string(value, params, message) {
            return typeof value === 'string' ? true : message('need_string', { value })
        }
    }
}

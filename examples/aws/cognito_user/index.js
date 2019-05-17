const user = require('./user')
const locale = require('./locales')
const attributes = require('./attributes')

/**
 * @name cognito_user
 * @param {string} [locale = en-us] 顯示語系
 */

module.exports = {
    sprites: {
        user,
        attributes
    },

    install(configs, options) {
        configs.locale = options.locale || configs.locale
        configs.messages = locale[configs.locale]
    },

    utils: {},

    configs: {
        locale: 'en-us',
        messages: null
    },

    methods: {
        $t(name) {
            return this.$configs[name] || name
        }
    },

    states: [],

    rules: {}
}

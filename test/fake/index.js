const user = require('./user')
const locale = require('./locale')
const attributes = require('./attributes')

module.exports = {
    sprites: {
        user,
        attributes
    },

    locale,

    install(configs, options) {
        configs.test = options.test
        return 'install'
    },

    utils: {},

    configs: {
        helloWorld: 'hello world'
    },

    methods: {
        helloWorld() {
            return this.$configs.helloWorld
        }
    },

    states: [
        'adminRead'
    ],

    rules: {
        alphanumeric(value) {
            var regex = /\W/ig
            return !regex.test(value) ? true : 'alphanumeric'
        }
    }
}

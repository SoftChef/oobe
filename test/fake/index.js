const user = require('./user')
const locales = require('./locales')
const attributes = require('./attributes')

module.exports = {
    sprites: {
        user,
        attributes
    },

    install(configs, options) {
        configs.test = options.test
        return 'install'
    },

    utils: {},

    configs: {
        locales,
        helloWorld: 'hello world'
    },

    methods: {
        helloWorld() {
            return this.$configs.helloWorld
        }
    },

    distortions: [
        'adminRead'
    ],

    rules: {
        alphanumeric(value) {
            var regex = /\W/ig
            return !regex.test(value) ? true : 'alphanumeric'
        }
    }
}

const user = require('./sprites/user')
const locale = require('./locale')
const attributes = require('./sprites/attributes')
const checkbody = require('./sprites/checkbody')

module.exports = {
    sprites: {
        user,
        checkbody,
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
        'adminRead',
        'create',
        'delete',
        'update'
    ],

    rules: {
        alphanumeric(value) {
            var regex = /\W/ig
            return !regex.test(value) ? true : 'alphanumeric'
        }
    }
}

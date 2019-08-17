const user = require('./sprites/user')
const locales = require('./locales')
const rawnull = require('./sprites/rawnull')
const attributes = require('./sprites/attributes')
const checkbody = require('./sprites/checkbody')

module.exports = {
    sprites: {
        user,
        rawnull,
        checkbody,
        attributes
    },

    locales,

    install(configs, options = {}) {
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

    dists: [
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

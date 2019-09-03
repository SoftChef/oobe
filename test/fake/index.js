const user = require('./sprites/user')
const locales = require('./locales')
const rawnull = require('./sprites/rawnull')
const userpool = require('./sprites/userpool')
const attributes = require('./sprites/attributes')
const checkbody = require('./sprites/checkbody')

module.exports = {
    sprites: {
        user,
        userpool,
        rawnull,
        checkbody,
        attributes
    },

    locales,

    install(configs, options = {}) {
        configs.test = options.test
        return 'install'
    },

    utils: {
        helloWorld() {
            return 'hello world'
        }
    },

    configs: {
        helloWorld: 'hello world'
    },

    methods: {
        helloWorld() {
            return this.$configs.helloWorld
        }
    },

    collectionMethods: {
        helloWorld() {
            return this.configs.helloWorld
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

const user = require('./user')
const attributes = require('./attributes')
const hello = function() {
    return 'hello'
}

module.exports = {
    sprites: {
        user,
        attributes
    },
    utils: {
        hello
    },
    methods: {
        world() {
            return 'world'
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

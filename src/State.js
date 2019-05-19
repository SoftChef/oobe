const Base = require('./Base')

class State extends Base {
    constructor(name, options = {}) {
        super('States')
        this.name = name
        this.options = this.$verify(options, {
            fixed: [false, ['object', 'string'], []],
            hidden: [false, ['object', 'string'], []],
            export: [false, ['function'], function() {
                return this.$toOrigin()
            }]
        })
    }
}

module.exports = State

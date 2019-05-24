const Base = require('./Base')

class State extends Base {
    constructor(name, options = {}) {
        super('States')
        this.name = name
        this.options = this.$verify(options, {
            fixed: [false, ['array', 'string'], []],
            hidden: [false, ['array', 'string'], []],
            export: [false, ['function'], function() {
                return this.$toOrigin()
            }]
        })
    }

    isFixed() {}

    isHidden() {}
}

module.exports = State

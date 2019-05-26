const Base = require('./Base')

class State extends Base {
    constructor(name, options = {}) {
        super('States')
        this.name = name
        this.options = this.$verify(options, {
            fixed: [false, ['array', 'string'], []],
            hidden: [false, ['array', 'string'], []],
            export: [false, ['function'], function() { return this.$toOrigin() }]
        })
    }

    isFixed(name) {
        if (this.options.fixed === '*') return true
        return this.options.fixed.includes(name)
    }

    isHidden(name) {
        if (this.options.hidden === '*') return true
        return this.options.hidden.includes(name)
    }
}

module.exports = State

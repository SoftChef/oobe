const Base = require('./Base')
const Helper = require('./Helper')

class Distortion extends Base {
    constructor(name, options = {}) {
        super('Distortion')
        this.name = name
        this.options = Helper.verify(options, {
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

module.exports = Distortion

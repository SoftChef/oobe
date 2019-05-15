const Base = require('./Base')

class Shape extends Base {
    constructor(name, options = {}) {
        super('Shape')
        this.name = name
        this.options = this.$verify(options, {
            fixed: [false, ['object', 'string'], []],
            export: [false, ['function'], function() {
                return this.$toOrigin()
            }]
        })
    }
}

module.exports = Shape

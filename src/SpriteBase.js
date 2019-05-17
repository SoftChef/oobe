const Base = require('./Base')
const State = require('./State')
const Sprite = require('./Sprite')

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.container = container
        this.options = this.$verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            reborn: [false, ['function'], function(data) { return data }],
            origin: [false, ['function'], function() { return this.$body() }],
            create: [false, ['function'], () => {}],
            states: [false, ['object'], {}],
            methods: [false, ['object'], {}]
        })
        this.initStates()
    }

    initStates() {
        this.states = {}
        let states = this.container.options.states.concat(['read', 'create', 'update', 'delete'])
        for (let name of states) {
            this.states[name] = new State(name, this.options.states[name])
        }
    }

    createSprite(data) {
        return new Sprite(this, data)
    }
}

module.exports = SpriteBase

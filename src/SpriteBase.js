const Base = require('./Base')
const State = require('./State')
const Sprite = require('./Sprite')
const Configs = require('./Configs')

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.states = {}
        this.container = container
        this.options = this.$verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            born: [false, ['function'], function(data) { return data }],
            views: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            watch: [false, ['object'], {}],
            origin: [false, ['function'], function() { return this.$body() }],
            states: [false, ['object'], {}],
            created: [false, ['function'], () => {}],
            methods: [false, ['object'], {}]
        })
        this.init()
    }

    init() {
        this.initStates()
    }

    initStates() {
        let states = this.container.options.states.concat(Configs.defaultState)
        for (let name of states) {
            this.states[name] = new State(name, this.options.states[name])
        }
    }

    create() {
        return new Sprite(this)
    }
}

module.exports = SpriteBase

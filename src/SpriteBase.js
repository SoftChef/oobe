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
            rules: [false, ['object'], {}],
            watch: [false, ['object'], {}],
            reborn: [false, ['function'], function(data) { return data }],
            origin: [false, ['function'], function() { return this.$body() }],
            create: [false, ['function'], () => {}],
            states: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            computed: [false, ['object'], {}]
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

    create(data) {
        return new Sprite(this, data)
    }
}

module.exports = SpriteBase

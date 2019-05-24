const Base = require('./Base')
const Rule = require('./Rule')
const Message = require('./Message')
const SpriteBase = require('./SpriteBase')

class Container extends Base {
    constructor(core, options = {}) {
        super('Container')
        this.core = core
        this.rule = new Rule()
        this.message = new Message()
        this.message.add(options.locale || {})
        this.spriteBases = {}
        this.options = this.$verify(options, {
            rules: [false, ['object'], {}],
            utils: [false, ['object'], {}],
            states: [false, ['array'], []],
            sprites: [true, ['object']],
            configs: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            install: [false, ['function'], () => {}]
        })
        this.init()
    }

    // ===================
    //
    // init
    //

    init() {
        this.initRules()
        this.initSprites()
    }

    initRules() {
        this.rule.addMultiple(this.options.rules)
    }

    initSprites() {
        for (let key in this.options.sprites) {
            this.spriteBases[key] = new SpriteBase(this, key, this.options.sprites[key])
        }
    }

    // ===================
    //
    // get
    //

    getRule(name, target) {
        return this.isCallSelf(name) ? this.rule.get(name.slice(1), target) : this.core.rule.get(name, target)
    }

    getMessage(name, values) {
        return this.isCallSelf(name) ? this.message.get(name.slice(1), values) : this.core.message.get(name, values)
    }

    getConfigs() {
        return this.options.configs
    }

    // ===================
    //
    // methods
    //

    isCallSelf(value) {
        return value.slice(0, 1) === '$'
    }

    // ===================
    //
    // public
    //

    make(baseName, data) {
        let base = this.spriteBases[baseName]
        if (base == null) {
            return this.$systemError('make', `Sprite ${baseName} not found.`)
        }
        return base.createSprite(data)
    }
}

module.exports = Container

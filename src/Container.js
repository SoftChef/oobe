const Base = require('./Base')
const SpriteBase = require('./SpriteBase')

class Container extends Base {
    constructor(core, name, options = {}) {
        super('Container')
        this.core = core
        this.name = name
        this.pluginName = '$' + this.name + '/'
        this.spriteBases = {}
        this.options = this.$verify(options, {
            rules: [false, ['object'], {}],
            utils: [false, ['object'], {}],
            states: [false, ['array'], []],
            locale: [false, ['object'], {}],
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
        this.initMessage()
    }

    initRules() {
        this.core.rule.addMultiple(this.options.rules, this.pluginName)
    }

    initSprites() {
        for (let key in this.options.sprites) {
            this.spriteBases[key] = new SpriteBase(this, key, this.options.sprites[key])
        }
    }

    initMessage() {
        this.core.message.add(this.options.locale, this.pluginName)
    }

    // ===================
    //
    // get
    //

    getRules(target, array) {
        return this.core.rule.getMore(target, this.getNames(array))
    }

    getMessage(name, values) {
        return this.core.message.get(this.getName(name), values)
    }

    getConfigs() {
        return this.options.configs
    }

    // ===================
    //
    // methods
    //

    getName(name) {
        return name.slice(0, 1) === '$' ? this.pluginName + name.slice(1) : name
    }

    getNames(array) {
        let data = array.slice()
        for (let i = 0; i < array.length; i++) {
            data[i] = this.getName(array[i])
        }
        return data
    }

    validate(target, value, array) {
        return this.core.rule.validate(target, value, this.getNames(array))
    }

    // ===================
    //
    // public
    //

    make(baseName) {
        let base = this.spriteBases[baseName]
        if (base == null) {
            return this.$systemError('make', `Sprite ${baseName} not found.`)
        }
        return base.create()
    }
}

module.exports = Container

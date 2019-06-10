const Base = require('./Base')
const SpriteBase = require('./SpriteBase')

class Container extends Base {
    constructor(core, name, options = {}) {
        super('Container')
        this.core = core
        this.name = name
        this.prefix = '$' + this.name + '.'
        this.spriteBases = {}
        this.options = this.$verify(options, {
            rules: [false, ['object'], {}],
            utils: [false, ['object'], {}],
            states: [false, ['array'], []],
            sprites: [true, ['object']],
            locales: [false, ['object'], {}],
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
        this.core.rule.addMultiple(this.options.rules, this.prefix)
    }

    initSprites() {
        for (let key in this.options.sprites) {
            this.spriteBases[key] = new SpriteBase(this, key, this.options.sprites[key])
        }
    }

    initMessage() {
        this.core.message.add(this.options.locales, this.prefix)
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
        return name[0] === '#' ? name : this.prefix + name
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

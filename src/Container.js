const Base = require('./Base')
const Rule = require('./Rule')
const Helper = require('./Helper')
const SpriteBase = require('./SpriteBase')

class Container extends Base {
    constructor(core, options = {}) {
        super('Container')
        this.core = core
        this.rule = new Rule()
        this.options = this.$verify(options, {
            rules: [false, ['object'], {}],
            utils: [false, ['object'], {}],
            sprites: [true, ['object']],
            configs: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            install: [false, ['function'], () => {}],
            distortions: [false, ['object'], []]
        })
        this.initRules()
        this.initSprites()
    }

    initRules() {
        for (let key in this.options.rules) {
            this.rule.add(key, this.options.rules[key])
        }
    }

    initSprites() {
        this.spriteBases = {}
        for (let key in this.options.sprites) {
            this.spriteBases[key] = new SpriteBase(this, key, this.options.sprites[key])
        }
    }

    getRule(name) {
        return name.slice(0, 1) === '$' ? this.rule.get(name.slice(1)) : this.core.getRule(name)
    }

    getConfigs() {
        return Helper.deepClone(this.options.configs)
    }

    make(baseName, data) {
        let base = this.spriteBases[baseName]
        if (base == null) {
            return this.$systemError('make', `Sprite ${baseName} not found.`)
        }
        return base.createSprite(data)
    }
}

module.exports = Container

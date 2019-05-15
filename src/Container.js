const Base = require('./Base')
const Rule = require('./Rule')
const SpriteBase = require('./SpriteBase')

class Container extends Base {
    constructor(core, options = {}) {
        super('Container')
        this.core = core
        this.rule = new Rule()
        this.options = this.$verify(options, {
            utils: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            sprites: [true, ['object']],
            methods: [false, ['object'], {}],
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

    make(baseName, data) {
        let base = this.spriteBases[baseName]
        if (base == null) {
            return this.$systemError('make', `Sprite ${baseName} not found.`)
        }
        return base.createSprite(data)
    }
}

module.exports = Container

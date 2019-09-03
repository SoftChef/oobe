const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const SpriteBase = require('./SpriteBase')

/**
 * @namespace Container
 * @property {object.<SpriteBase>} sprites 精靈組
 * @property {array.<string>} [dists] 擴展狀態集
 * @property {object.<fn>} [rules] 私有規則
 * @property {object} [utils] 擴充工具
 * @property {object} [locales] 語系組
 * @property {object} [configs] 通用設定
 * @property {object.<fn>} [methods] 通用方法
 * @property {function} [install] 在加入core時觸發
 * @property {object.<array>} [interface] 建立設計規範，不符合規範的精靈會被擲出錯誤
 * @see {@link SpriteBase}
 * @example
 * // interface
 * let interface = {
 *     views: ['...'],
 *     dists: ['...'],
 *     methods: ['...']
 * }
 */

class Container extends Base {
    constructor(core, name, options = {}) {
        super('Container')
        this.core = core
        this.name = name
        this.prefix = '$' + this.name + '.'
        this.spriteBases = {}
        this.options = Helper.verify(options, {
            rules: [false, ['object'], {}],
            utils: [false, ['object'], {}],
            dists: [false, ['array'], []],
            sprites: [true, ['object']],
            locales: [false, ['object'], {}],
            configs: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            install: [false, ['function'], () => {}],
            interface: [false, ['object'], {}],
            collectionMethods: [false, ['object'], {}]
        })
        this.init()
    }

    // ===================
    //
    // init
    //

    init() {
        this.initEvent()
        this.initRules()
        this.initInterface()
        this.initSprites()
        this.initMessage()
    }

    initEvent() {
        this.event = new Event('container', this.core.event, {
            name: this.name
        })
    }

    initRules() {
        this.core.rule.addMultiple(this.options.rules, this.prefix)
    }

    initSprites() {
        for (let key in this.options.sprites) {
            let options = this.options.sprites[key]
            let checkInterface = this.checkInterface(options)
            if (checkInterface !== true) {
                this.$devError('initSprites', checkInterface)
            }
            this.spriteBases[key] = new SpriteBase(this, key, options)
        }
    }

    initMessage() {
        this.core.message.add(this.options.locales, this.prefix)
    }

    initInterface() {
        this.interface = Helper.verify(this.options.interface, {
            views: [false, ['array'], []],
            dists: [false, ['array'], []],
            methods: [false, ['array'], []]
        })
    }

    checkInterface(options) {
        let views = this.verifyInterface('views', options)
        let dists = this.verifyInterface('dists', options)
        let methods = this.verifyInterface('methods', options)
        if ((views.length + dists.length + methods.length) === 0) {
            return true
        }
        let message = 'Interface error for : '
        if (views.length !== 0) {
            message += `\nviews[${views.join()}]`
        }
        if (dists.length !== 0) {
            message += `\ndists[${dists.join()}]`
        }
        if (methods.length !== 0) {
            message += `\nmethods[${methods.join()}]`
        }
        return message
    }

    verifyInterface(name, options) {
        let target = options[name] || {}
        let output = []
        for (let key of this.interface[name]) {
            if (target[key] == null) {
                output.push(key)
            }
        }
        return output
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
            return this.$devError('make', `Sprite ${baseName} not found.`)
        }
        return base.create()
    }

    makeCollection(baseName, options) {
        let base = this.spriteBases[baseName]
        if (base == null) {
            return this.$devError('makeCollection', `Sprite ${baseName} not found.`)
        }
        return base.createCollection(options)
    }
}

module.exports = Container

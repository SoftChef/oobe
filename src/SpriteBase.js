const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const Configs = require('./Configs')
const SpriteUnit = require('./SpriteUnit')
const Distortion = require('./Distortion')
const CollectionUnit = require('./CollectionUnit')

/**
 * @namespace SpriteBase
 * @property {function} body 定義結構與預設值
 * @property {object.<string>} [refs] 該屬性參照其他精靈
 * @property {object.<fn>} [views] 經過計算後能夠呈現的值
 * @property {object.<array>} [rules] 屬性驗證規則組
 * @property {object} [dist] distortions模式
 * @property {array.<string>} [dist[].fixed] 目標值是否有fixed屬性
 * @property {array.<string>} [dist[].hidden] 目標值是否有hidden屬性
 * @property {function} [dist[].export] 該狀模式下的輸出產物
 * @property {object.<fn>} [methods] 私有方法
 * @property {function} [born] 攔截rawdata經運算再擲出
 * @property {function} [origin] 將資料轉換成原始資料再擲出
 * @property {function} [created] born後會觸發，一次sprite只會觸發一次
 */

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.dists = {}
        this.container = container
        this.options = Helper.verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            self: [false, ['function'], () => { return {} }],
            born: [false, ['function'], function(data) { return data }],
            views: [false, ['object'], {}],
            dists: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            origin: [false, ['function'], function() { return this.$body() }],
            methods: [false, ['object'], {}],
            created: [false, ['function'], () => {}],
            collection: [false, ['object'], {}],
            defaultView: [false, ['function'], null]
        })
        if (options.states) {
            throw new Error('States already rename to dists.')
        }
        this.init()
    }

    init() {
        this.initEvent()
        this.initViews()
        this.initDistortion()
        this.initMethods()
    }

    initEvent() {
        this.event = new Event('sprite', this.container.event, {
            name: this.name
        })
    }

    initDistortion() {
        let distortions = this.container.options.dists.concat(Configs.defaultDistortion)
        for (let name of distortions) {
            this.dists[name] = new Distortion(name, this.options.dists[name])
        }
    }

    initViews() {
        let views = this.options.views
        this.Views = function(unit) {
            this._views = views
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.Views.prototype, key, {
                get: function() {
                    return this._views[key].apply(this._target, arguments)
                }
            })
        }
    }

    initMethods() {
        let methods = {
            ...this.container.options.methods,
            ...this.options.methods
        }
        this.Methods = function(unit) {
            this._target = unit
            this._methods = methods
        }
        for (let key in methods) {
            this.Methods.prototype[key] = function() {
                return this._methods[key].apply(this._target, arguments)
            }
        }
    }

    isUs(sprite) {
        return sprite._sprite.base === this
    }

    getViews(unit) {
        return new this.Views(unit)
    }

    getMethods(unit) {
        return new this.Methods(unit)
    }

    create() {
        return new SpriteUnit(this)
    }

    createCollection() {
        return new CollectionUnit(this)
    }
}

module.exports = SpriteBase

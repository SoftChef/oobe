const Base = require('./Base')
const Event = require('./Event')
const State = require('./State')
const Helper = require('./Helper')
const Configs = require('./Configs')
const SpriteUnit = require('./SpriteUnit')

/**
 * @namespace SpriteBase
 * @property {function} body 定義結構與預設值
 * @property {object.<string>} [refs] 該屬性參照其他精靈
 * @property {object.<fn>} [views] 經過計算後能夠呈現的值
 * @property {object.<array>} [rules] 屬性驗證規則組
 * @property {object} [states] 狀態
 * @property {array.<string>} [states[].fixed] 目標值是否有fixed屬性
 * @property {array.<string>} [states[].hidden] 目標值是否有hidden屬性
 * @property {function} [states[].export] 該狀態下的輸出產物
 * @property {object.<fn>} [methods] 私有方法
 * @property {function} [born] 攔截rawdata經運算再擲出
 * @property {function} [origin] 將資料轉換成原始資料再擲出
 * @property {function} [created] born後會觸發，一次sprite只會觸發一次
 */

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.states = {}
        this.container = container
        this.options = Helper.verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            self: [false, ['function'], () => { return {} }],
            born: [false, ['function'], function(data) { return data }],
            views: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            origin: [false, ['function'], function() { return this.$body() }],
            states: [false, ['object'], {}],
            methods: [false, ['object'], {}],
            created: [false, ['function'], () => {}]
        })
        this.init()
    }

    init() {
        this.initEvent()
        this.initStates()
        this.initMethods()
    }

    initEvent() {
        this.event = new Event('base', this.container.event, {}, {
            name: this.name
        })
    }

    initStates() {
        let states = this.container.options.states.concat(Configs.defaultState)
        for (let name of states) {
            this.states[name] = new State(name, this.options.states[name])
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

    getMethods(unit) {
        return new this.Methods(unit)
    }

    create() {
        return new SpriteUnit(this)
    }
}

module.exports = SpriteBase

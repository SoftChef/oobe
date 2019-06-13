const Base = require('./Base')
const State = require('./State')
const Configs = require('./Configs')
const SpriteUnit = require('./SpriteUnit')

/**
 * @namespace SpriteBase
 * @property {function} body 定義結構與預設值
 * @property {object.<string>} [refs] 該屬性參照其他精靈
 * @property {object.<fn>} [views] 經過計算後能夠呈現的值
 * @property {object.<array>} [rules] 屬性驗證規則組
 * @property {object.<fn>} [watch] 監聽屬性變動
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
        return new SpriteUnit(this)
    }
}

module.exports = SpriteBase

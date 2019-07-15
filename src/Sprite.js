const Helper = require('./Helper')

function getUnit(target) {
    return target instanceof Sprite ? target : target.unit
}

/**
 * export sprite
 * @hideconstructor
 * @property {object} utils 來自container utils物件
 * @property {Helper} helper helper的接口
 * @property {object} configs 來自container configs物件
 * @property {string} state 現在狀態
 * @property {boolean} live 目前是否為激活狀態
 * @property {boolean} ready 是否宣告過born
 */

class Sprite {
    constructor(sprite) {
        this._sprite = sprite
        this._container = this._sprite.base.container
        this.$utils = this._container.options.utils
        this.$helper = Helper
        this.$configs = this._container.getConfigs()
        Object.defineProperty(this, '$live', { get: () => this._sprite.status.live })
        Object.defineProperty(this, '$state', { get: () => this._sprite.state.name })
        Object.defineProperty(this, '$ready', { get: () => this._sprite.status.ready })
    }

    /**
     * 獲取語系資源
     * @param {string} name 語系的對應key
     * @param {object} [value] 動態參數
     * @returns {string}
     */

    $meg(name, value) {
        return this._container.getMessage(name, value)
    }

    /**
     * 複製一份sprite並休眠宣告對象
     * @returns {outSprite}
     */

    $out() {
        return getUnit(this._sprite.out())
    }

    /**
     * 關閉這個sprite並喚醒宣告此sprite的對象(無對象的sprite無法宣告)
     * @returns {originSprite}
     */

    $dead() {
        return getUnit(this._sprite.dead())
    }

    /**
     * 初始化並賦予值，並將ready宣告成true
     * @returns {this}
     */

    $born(data) {
        return getUnit(this._sprite.born(data))
    }

    /**
     * 複製當前sprite
     * @returns {sprite}
     */

    $copy() {
        return getUnit(this._sprite.copy())
    }

    /**
     * 綁定一個method
     * @returns {function}
     */

    $bind(name) {
        return this._sprite.bind(name)
    }

    /**
     * 獲取body的所有值(為複製對象)
     * @returns {object}
     */

    $body() {
        return this._sprite.getBody()
    }

    /**
     * 獲取body與refs的鍵值
     * @returns {array.<string>}
     */

    $keys() {
        return this._sprite.getKeys()
    }

    /**
     * 把值切回born賦予的狀態
     * @param {string} [key] 是否針對某個屬性重設
     */

    $reset(key) {
        return this._sprite.reset(key)
    }

    /**
     * 獲取指定屬性的規則集
     * @param {string} name 指定屬性
     * @param {array.<string|fn>} [extra] 擴充規則
     * @returns {array.<fn>}
     */

    $rules(name, extra = []) {
        return this._sprite.getRules(name, extra)
    }

    /**
     * 把out sprite的資料回歸至origin sprite
     * @returns {originSprite}
     */

    $revive() {
        return getUnit(this._sprite.revive())
    }

    /**
     * 輸出當前狀態指定的export
     * @param {string} [name] 指定狀態
     * @returns {object}
     */

    $export(name) {
        return this._sprite.export(name)
    }

    /**
     * 當前狀態的屬性是否有fixed屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $isFixed(name) {
        return this._sprite.state.isFixed(name)
    }

    /**
     * 當前狀態的屬性是否有hidden屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $isHidden(name) {
        return this._sprite.state.isHidden(name)
    }

    /**
     * 當前狀態的屬性是否沒hidden屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $show(name) {
        return !this._sprite.state.isHidden(name)
    }

    /**
     * 執行origin參數並回傳結果
     * @returns {object}
     */

    $toOrigin() {
        return this._sprite.toOrigin()
    }

    /**
     * 狀態是否與born時的狀態相異
     * @param {string} [key] 是否針對某個屬性作判別
     * @returns {boolean}
     */

    $isChange(key) {
        return this._sprite.isChange(key)
    }

    /**
     * 驗證當下參數是否符合驗證規則
     * @returns {object}
     */

    $validate() {
        return this._sprite.validateAll()
    }

    /**
     * 轉換狀態
     * @param {string} name 指定狀態名稱
     * @returns {this}
     */

    $distortion(name) {
        return getUnit(this._sprite.distortion(name))
    }
}

module.exports = Sprite

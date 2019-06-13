const Core = require('./Core')
const Helper = require('./Helper')

/**
 * Main export class
 */

class Oobe {
    constructor() {
        this._core = new Core()
    }

    /**
     * 獲取語系資源
     * @param {string} name 語系的對應key
     * @param {object} [value] 動態參數
     * @returns {string}
     */

    meg(name, value) {
        return this._core.message.get(name, value)
    }

    /**
     * 建立精靈
     * @param {string} containerName container的名稱
     * @param {string} spriteName sprite的名稱
     * @returns {sprite}
     * @see {@link Sprite}
     */

    make(containerName, spriteName) {
        return this._core.make(containerName, spriteName)
    }

    /**
     * 批次建立精靈，會預設呼叫born於建立的過程中。
     * @param {string} containerName container的名稱
     * @param {string} spriteName sprite的名稱
     * @param {array} data 批次建立的資料集
     * @returns {array}
     */

    batch(containerName, spriteName, data) {
        return this._core.batch(containerName, spriteName, data)
    }

    /**
     * 加入一組container。
     * @param {string} name container的名稱
     * @param {object} data container的資料
     * @param {object} [options] 與container交換的資料
     * @returns {*} container執行install後的回傳值
     * @see {@link Container}
     */

    join(name, data, options) {
        let container = this._core.addContainer(name, data)
        let configs = container.options.configs
        return container.options.install.call(this, configs, options)
    }

    /**
     * 加入一組package。
     * @param {object} optinos package所需物件
     * @param {string} optinos.name package所需物件
     * @param {object} [optinos.rules] rule
     * @param {object} [optinos.locales] locales
     */

    addon(optinos) {
        this._core.addon(optinos)
    }

    /**
     * 獲取指定的規則集
     * @param {array.<string|fn>} data
     * @returns {array.<fn>}
     */

    getRules(data) {
        return this._core.getRules(data)
    }

    /**
     * 設定當前語系
     * @param {string} locale 設定指定語系，預設為'en-us'
     */

    setLocale(locale) {
        this._core.setLocale(locale)
    }

    /**
     * @callback bridge
     * @param {string} containerName
     * @param {string} spriteName
     */

    /**
     * 設定make之前的hook，為的是nodejs的動態載入環境
     * @param {bridge} bridge 指定的回乎函數
     */

    setBridge(bridge) {
        this._core.setBridge(bridge)
    }
}

/**
 * Helper的全域接口
 * @static
 * @see {@link Helper}
 */

Oobe.helper = Helper

module.exports = Oobe

const Base = require('./Base')
const Core = require('./Core')
const Helper = require('./Helper')

/**
 * Main export class
 */

class Oobe extends Base {
    constructor() {
        super('Oobe')
        this._core = new Core()
    }

    /**
     * 觸發一個事件
     * @param {string} channelName 事件名稱
     * @param {object} params 傳遞參數
     */

    on(channelName, callback) {
        return this._core.event.on(channelName, callback)
    }

    /**
     * 移除一個事件
     * @param {string} channelName 事件名稱
     * @param {string} name 事件id
     */

    off(channelName, name) {
        return this._core.event.off(channelName, name)
    }

    /**
     * 發送一個事件
     * @param {string} channelName 事件名稱
     * @param {object} params 傳遞參數
     */

    emit(channelName, ...params) {
        return this._core.event.emit(this, channelName, params)
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
     * 建立精靈集合。
     * @param {string} containerName container的名稱
     * @param {string} spriteName sprite的名稱
     * @param {object} optnios collection的選項
     * @returns {@link Collection}
     */

    collection(containerName, spriteName, optnios) {
        return this._core.makeCollection(containerName, spriteName, optnios)
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
     * 驗證資料是否符合精靈的驗證規則
     * @param {string} containerName
     * @param {string} spriteName
     * @param {object} data 驗證對象
     * @returns {object} { success, result }
     */

    validateForSprite(containerName, spriteName, data) {
        return this._core.validateForSprite(containerName, spriteName, data)
    }

    /**
     * 設定當前語系
     * @param {string} locale 設定指定語系，預設為'en-us'
     */

    setLocale(locale) {
        this._core.setLocale(locale)
    }

    /**
     * 驗證該sprite是否為指定的精靈
     * @param {string} containerName 指定container
     * @param {string} name 精靈name
     * @param {sprite} target 目標對象
     * @returns {boolean}
     */

    instanceof(containerName, name, target) {
        if (Helper.isSprite(target) === false) {
            this.$devError('instanceof', `Target not a sprite.`)
        }
        let container = target._container
        let spriteBase = target._sprite.base
        let targetContainer = this._core.containers[containerName]
        let targetSpriteBase = targetContainer.spriteBases[name]
        return container === targetContainer && spriteBase === targetSpriteBase
    }
}

/**
 * Helper的全域接口
 * @static
 * @see {@link Helper}
 */

Oobe.helper = Helper

module.exports = Oobe

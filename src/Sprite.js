const Helper = require('./Helper')

function getUnit(target) {
    return target instanceof Sprite ? target : target.unit
}

/**
 * export sprite
 * @hideconstructor
 */

class Sprite {
    constructor(sprite) {
        this._sprite = sprite
        this._container = sprite.base.container

        /** Self object */

        this.$self = null
    }

    /** Shorthand for $views. */

    get $v() {
        return this._sprite.views
    }

    /** Views */

    get $views() {
        return this._sprite.views
    }

    /** Use $out() and out sprite no call $dead() or $reborn(). */

    get $live() {
        return this._sprite.status.live
    }

    /** Utils interface. */

    get $utils() {
        return this._container.options.utils
    }

    /** From container configs. */

    get $configs() {
        return this._container.getConfigs()
    }

    /** Helper interface */

    get $helper() {
        return Helper
    }

    /** Now distortion status. */

    get $distName() {
        return this._sprite.dist.name
    }

    /** Whether to call $born(). */

    get $ready() {
        return this._sprite.status.ready
    }

    /** Whether is error, have error return error message. */

    get $error() {
        return this._sprite.getErrorMessage()
    }

    /** If this sprite is a reference, get reference aims. */

    get $parent() {
        return this._sprite.parent
    }

    /** Methods interface */

    get $fn() {
        return this._sprite.functions
    }

    /**
     * Attached event handler.
     * @param {string} channelName
     * @param {object} params
     */

    $on(channelName, callback) {
        return this._sprite.event.on(channelName, callback)
    }

    /**
     * Attached event handler, but only trigger once.
     * @param {string} channelName
     * @param {object} callback
     */

    $onOnce(channelName, callback) {
        return this._sprite.event.once(channelName, callback)
    }

    /**
     * Remove a event.
     * @param {string} channelName
     * @param {string|object} id Event id or has {id} object.
     */

    $off(channelName, id) {
        return this._sprite.event.off(channelName, id)
    }

    /**
     * Emit a event.
     * @param {string} channelName
     * @param {...*} params
     */

    $emit(channelName, ...params) {
        return this._sprite.event.emit(this, channelName, params)
    }

    /**
     * Update to body key.
     * @param {object} data
     */

    $put(data) {
        return getUnit(this._sprite.put(data))
    }

    /**
     * Get raw data.
     * @param {object} [assign] Use helper deepObjectAssign replace origin data.
     * @returns {*}
     */

    $raw(assign) {
        return this._sprite.getRawdata(assign)
    }

    /**
     * Get locale message.
     * @param {string} name key name
     * @param {object} [value] parameter
     * @returns {string}
     */

    $meg(name, value) {
        return this._container.getMessage(name, value)
    }

    /**
     * Copy sprite and let this sprite to sleep.
     * @returns {Sprite}
     */

    $out() {
        return getUnit(this._sprite.out())
    }

    /**
     * Close this sprite and wake up parent sprite, only have carry parent sprite can use this method.
     * @returns {Sprite}
     */

    $dead() {
        return getUnit(this._sprite.dead())
    }

    /**
     * Initialization data, and $ready to the true.
     * @returns {this}
     */

    $born(data) {
        return getUnit(this._sprite.born(data))
    }

    /**
     * Copy this sprite.
     * @returns {sprite}
     */

    $copy() {
        return getUnit(this._sprite.copy())
    }

    /**
     * Bind method, let return function this to sprite.
     * @returns {function}
     */

    $bind(name) {
        return this._sprite.bind(name)
    }

    /**
     * Get body data, and body is copy object.
     * @returns {object}
     */

    $body() {
        return this._sprite.getBody()
    }

    /**
     * Get body and refs keys.
     * @returns {array.<string>}
     */

    $keys() {
        return this._sprite.getKeys()
    }

    /**
     * Restore data to born status.
     * @param {string} [key] Can for target key to reset.
     */

    $reset(key) {
        return this._sprite.reset(key)
    }

    /**
     * Get rules.
     * @param {string} name
     * @param {array.<string|fn>} [extra]
     * @returns {array.<fn>}
     */

    $rules(name, extra = []) {
        return this._sprite.getRules(name, extra)
    }

    /**
     * Return oobe object, for the invoke.
     * @returns {object}
     */

    $toObject() {
        return this._sprite.toObject()
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

    $export(name, ...args) {
        return this._sprite.export(name, args)
    }

    /**
     * 當前狀態的屬性是否有fixed屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $isFixed(name) {
        return this._sprite.dist.isFixed(name)
    }

    /**
     * 當前狀態的屬性是否有hidden屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $isHidden(name) {
        return this._sprite.dist.isHidden(name)
    }

    /**
     * 當前狀態的屬性是否沒hidden屬性
     * @param {string} name 指定屬性名稱
     * @returns {boolean}
     */

    $show(name) {
        return !this._sprite.dist.isHidden(name)
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

    /**
     * 轉換狀態，$distortion的縮寫
     * @param {string} name 指定狀態名稱
     * @returns {this}
     */

    $dist(name) {
        return this.$distortion(name)
    }

    /**
     * This sprite will set to error.
     * @param {*} data error data
     */

    $setError(data) {
        return this._sprite.setError(data)
    }
}

module.exports = Sprite

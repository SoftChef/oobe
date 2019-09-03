const Helper = require('./Helper')

/**
 * export collection
 * @hideconstructor
 */

class Collection {
    constructor(collection) {
        this._collection = collection
    }

    /** collection內部長度 */

    get size() {
        return this._collection.items.length
    }

    /** collection的資料集 */

    get items() {
        return this._collection.items
    }

    /** 是否宣告過write */

    get dirty() {
        return this._collection.status.dirty
    }

    /** collection views */

    get views() {
        return this._collection.views
    }

    /** collection methods */

    get methods() {
        return this._collection.methods
    }

    /**
     * utils的接口
     */

    get utils() {
        return this._collection.base.container.options.utils
    }

    /**
     * 來自container configs物件
     */

    get configs() {
        return this._collection.base.container.getConfigs()
    }

    /**
     * Helper的接口
     */

    get helper() {
        return Helper
    }

    /**
     * 如果該集合是參考對象，則獲取參考對象的對象
     */

    get parent() {
        return this._collection.parent
    }

    /**
     * 迭代所有sprite，回傳'_break'會跳出迭代
     * @param {function} callback 回呼函數
     */

    forEach(callback) {
        return this._collection.forEach(callback)
    }

    /**
     * 獲得所有sprite的body
     * @returns {array}
     */

    getBodys() {
        return this._collection.getBodys()
    }

    /**
     * 內部的sprite是否被更動過
     * @returns {boolean}
     */

    isChange() {
        return this._collection.isChange()
    }

    /**
     * 驗證內部所有精靈
     * @returns {object} { result, success }
     */

    validate() {
        return this._collection.validateAll()
    }

    /**
     * 畸變內部所有精靈
     * @param {string} name distName
     */

    distAll(name) {
        return this._collection.distortion(name)
    }

    /**
     * 監聽一個事件，但只觸發一次
     * @param {string} channelName 事件名稱
     * @param {object} callback 觸發事件
     */

    on(channelName, callback) {
        return this._collection.event.on(channelName, callback)
    }

    /**
     * 監聽一個事件，但只觸發一次
     * @param {string} channelName 事件名稱
     * @param {object} callback 觸發事件
     */

    onOnce(channelName, callback) {
        return this._collection.event.once(channelName, callback)
    }

    /**
     * 移除一個事件
     * @param {string} channelName 事件名稱
     * @param {string|object} id 事件id或帶有{id}屬性的物件
     */

    off(channelName, id) {
        return this._collection.event.off(channelName, id)
    }

    /**
     * 發送一個事件
     * @param {string} channelName 事件名稱
     * @param {object} params 傳遞參數
     */

    emit(channelName, ...params) {
        return this._collection.event.emit(channelName, params)
    }

    /**
     * 有無一個對象
     * @param {string} key 對象key
     */

    has(key) {
        return this._collection.has(key)
    }

    /**
     * 獲取一個對象
     * @param {string} key 對象的key
     */

    fetch(key) {
        return this._collection.fetch(key)
    }

    /**
     * 寫入一組資料，當有重複的key鍵則取代
     * @param {object|sprite} data source data
     */

    write(data) {
        return this._collection.write(data)
    }

    /**
     * 批次寫入資料
     * @param {array} data source data
     */

    batchWrite(data) {
        return this._collection.batchWrite(data)
    }

    /**
     * 非同步寫入精靈
     * @param {array} items source data
     * @param {number} [ms=10] 每筆資料寫入的速度(毫秒)
     * @returns {promise}
     */

    batchWriteAsync(items, ms = 10) {
        return this._collection.batchWriteAsync(items, ms)
    }

    /**
     * 移除指定資料
     * @param {string} key 對象key
     */

    remove(key) {
        return this._collection.remove(key)
    }

    /**
     * 清空所有資料
     */

    clear() {
        return this._collection.clear()
    }
}

module.exports = Collection

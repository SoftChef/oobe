
/**
 * export collection
 * @hideconstructor
 * @property {array} items collection的資料集
 * @property {number} size collection內部長度
 * @property {boolean} isDirty 是否被寫入過資料
 */

class Collection {
    constructor(collection) {
        this._collection = collection
    }

    get size() {
        return this._collection.items.length
    }

    get items() {
        return this._collection.items.slice()
    }

    get dirty() {
        return this._collection.status.dirty
    }

    /**
     * 觸發一個事件
     * @param {string} channelName 事件名稱
     * @param {object} callback 觸發事件
     */

    on(channelName, callback) {
        return this._collection.event.on(channelName, callback)
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
     * @param {object} data source data
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

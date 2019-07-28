class Collection {
    constructor(collection) {
        this._collection = collection
    }

    get size() {
        return this._collection.size
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
     * @param {string} id 事件id
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

    has(key) {
        return this._collection.has(key)
    }

    fetch(key) {
        return this._collection.fetch(key)
    }

    list() {
        return this._collection.list()
    }

    write(data) {
        return this._collection.write(data)
    }

    batchWrite(data) {
        return this._collection.batchWrite(data)
    }

    remove(key) {
        return this._collection.remove(key)
    }
}

module.exports = Collection

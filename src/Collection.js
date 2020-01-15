const Helper = require('./Helper')

/**
 * export collection
 * @hideconstructor
 */

class Collection {
    constructor(collection) {
        this._collection = collection
    }

    /** Collection size. */

    get size() {
        return this._collection.items.length
    }

    /** Collection real data. */

    get items() {
        return this._collection.items
    }

    /** Have you ever called the write method, you can use setDirty(boolean) to change the state. */

    get dirty() {
        return this._collection.status.dirty
    }

    /** Collection views. */

    get views() {
        return this._collection.views
    }

    /** Collection methods. */

    get methods() {
        return this._collection.methods
    }

    /** Collection loaders. */

    get loaders() {
        return this._collection.loaders
    }

    /** Utils interface. */

    get utils() {
        return this._collection.base.container.options.utils
    }

    /** Come from to container configs. */

    get configs() {
        return this._collection.base.container.getConfigs()
    }

    /** Helper interface */

    get helper() {
        return Helper
    }

    /** If this collection is a reference, get reference aims. */

    get parent() {
        return this._collection.parent
    }

    /**
     * Change dirty status.
     * @param {boolean} status
     */

    setDirty(status) {
        return this._collection.setDirty(status)
    }

    /**
     * Iteration all sprite, if callback return is '_break' string else break loop.
     * @param {function} callback
     * @example
     * collection.forEach((sprite, index) => {
     *      // do something...
     * })
     */

    forEach(callback) {
        return this._collection.forEach(callback)
    }

    /**
     * Get all sprite $body() return values.
     * @returns {array}
     */

    getBodys() {
        return this._collection.getBodys()
    }

    /**
     * Get all sprite $toOrigin() return values.
     * @returns {array}
     */

    getOrigins() {
        return this._collection.getOrigins()
    }

    /**
     * Get all sprite $export() return values.
     * @param {string} [name] Specified distortion.
     * @param {...*} [args]
     * @returns {array}
     */

    getExports(name, ...args) {
        return this._collection.getExports(name, args)
    }

    /**
     * Check if any sprite has changed.
     * @returns {boolean}
     */

    isChange() {
        return this._collection.isChange()
    }

    /**
     * Get all sprite $validate() return values.
     * @returns {object} { result, success }
     */

    validate() {
        return this._collection.validateAll()
    }

    /**
     * Call all sprite $dist() method.
     * @param {string} name distName
     */

    distAll(name) {
        return this._collection.distortion(name)
    }

    /**
     * Attached event handler.
     * @param {string} channelName
     * @param {object} handler
     */

    on(channelName, handler) {
        return this._collection.event.on(channelName, handler)
    }

    /**
     * Attached event handler, but only trigger once.
     * @param {string} channelName
     * @param {object} handler
     */

    onOnce(channelName, handler) {
        return this._collection.event.once(channelName, handler)
    }

    /**
     * Remove a event.
     * @param {string} channelName
     * @param {string|object} id Event id or has {id} object.
     */

    off(channelName, id) {
        return this._collection.event.off(channelName, id)
    }

    /**
     * Emit a event.
     * @param {string} channelName
     * @param {...*} params
     */

    emit(channelName, ...params) {
        return this._collection.event.emit(this, channelName, params)
    }

    /**
     * Have Items corresponding to the key.
     * @param {string} key
     */

    has(key) {
        return this._collection.has(key)
    }

    /**
     * Get Items corresponding to the key.
     * @param {string} key
     */

    fetch(key) {
        return this._collection.fetch(key)
    }

    /**
     * Write data in the collection and replace it if items have the same key.
     * @param {object|sprite} data
     */

    write(data) {
        return this._collection.write(data)
    }

    /**
     * Batch trigger write.
     * @param {array} data
     */

    batchWrite(data) {
        return this._collection.batchWrite(data)
    }

    /**
     * Batch trigger write and only key.
     * @param {string} key Key name.
     * @param {array} items ['name', 'name2'...]
     */

    batchWriteOnlyKeys(key, data) {
        return this._collection.batchWriteOnlyKeys(key, data)
    }

    /**
     * Batch trigger write with async.
     * @param {array} items
     * @param {number} [ms=2] Speed of data queue write(milliseconds).
     * @param {number} [parallel=1] Parallel write quantity of every millisecond.
     * @returns {promise}
     */

    batchWriteAsync(items, ms = 2, parallel = 1) {
        return this._collection.batchWriteAsync(items, ms, parallel)
    }

    /**
     * Remove data by key.
     * @param {string} key
     */

    remove(key) {
        return this._collection.remove(key)
    }

    /**
     * Clear all data.
     */

    clear() {
        return this._collection.clear()
    }

    /**
     * Sprtie to key.
     * @param {object} data
     * @returns {string}
     */

    toKey(data) {
        return this._collection.options.key(data)
    }
}

module.exports = Collection

const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const Collection = require('./Collection')

class CollectionUnit extends Base {
    constructor(base) {
        super('Collection')
        this.map = new Map()
        this.base = base
        this.unit = new Collection(this)
        this.event = new Event('collection', this.base.event)
        this.options = Helper.verify(base.options.collection, {
            key: [false, ['function', 'string'], '*']
        })
    }

    get size() {
        return this.map.size
    }

    write(data) {
        if (Helper.getType(data) !== 'object') {
            this.$devError('write', 'Source not a object')
        }
        let sprite = this.base.create().unit.$born(data)
        let hashKey = this.options.key !== '*' ? this.options.key(sprite) : Helper.generateId()
        if (Helper.getType(hashKey) !== 'string') {
            this.$devError('write', `Write key(${hashKey}) not a string`)
        }
        this.map.set(hashKey, sprite)
    }

    batchWrite(items) {
        if (Helper.getType(items) !== 'array') {
            this.$devError('batchWrite', 'Data not a array.')
        }
        for (let item of items) {
            this.write(item)
        }
    }

    has(key) {
        return this.map.has(key)
    }

    list() {
        let keys = this.map.keys()
        let output = []
        for (let key of keys) {
            output.push(this.fetch(key))
        }
        return output
    }

    /**
     * 獲取對象且有真實對象時觸發
     * @event Collection#$fetch
     * @property {object} context
     * @property {sprite} 獲取的精靈
     */

    /**
     * 獲取對象為空時觸發
     * @event Collection#$fetchFail
     * @property {object} context
     * @property {string} 獲取的key
     */

    fetch(key) {
        let sprite = this.map.get(key)
        if (sprite) {
            this.event.emit(this.unit, '$fetch', [ sprite ])
        } else {
            this.event.emit(this.unit, '$fetchFail', [ key ])
        }
        return sprite
    }

    clear() {
        this.map.clear()
    }

    remove(key) {
        this.map.delete(key)
    }
}

module.exports = CollectionUnit

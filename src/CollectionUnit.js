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
            key: [false, ['string'], '*']
        })
    }

    get size() {
        return this.map.size
    }

    write(data) {
        if (Helper.getType(data) !== 'object') {
            this.$systemError('write', 'Source not a object')
        }
        let key = this.options.key
        let sprite = this.base.create().unit.$born(data)
        let hashKey = key !== '*' ? sprite[key] : Helper.generateId()
        if (Helper.getType(hashKey) !== 'string') {
            this.$systemError('write', `Write key(${hashKey}) not a string`)
        }
        this.map.set(hashKey, sprite)
    }

    batchWrite(items) {
        if (Helper.getType(items) !== 'array') {
            this.$systemError('batchWrite', 'Data not a array.')
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

    fetch(key) {
        let sprite = this.map.get(key)
        this.event.emit(this.unit, '$fetch', [ sprite ])
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

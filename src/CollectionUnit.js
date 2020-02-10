const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const Loader = require('./Loader')
const Collection = require('./Collection')

class CollectionUnit extends Base {
    /**
     * Invoke core.collection() to trigger.
     * @event Collection#$init
     * @property {object} context
     * @property {Collection} self
     */

    constructor(base, options) {
        super('Collection')
        this.map = {}
        this.base = base
        this.unit = new Collection(this)
        this.items = []
        this.event = new Event('collection', this.base.event)
        this.views = new base.CollectionViews(this.unit)
        this.methods = new base.CollectionMethods(this.unit)
        this.parent = null
        this.status = {
            dirty: false
        }
        this.customOptions = options
        this.options = Helper.verify(base.options.collection, {
            key: [false, ['function', 'string'], '*'],
            write: [false, ['function'], ({ success }) => { success() }],
            writeAfter: [false, ['function'], null],
            views: [false, ['object'], {}],
            loaders: [false, ['object'], null]
        })
        this.loaders = Loader(this.unit, 'collection', this.options.loaders)
        this.event.emit(this.unit, '$init', [this.unit])
    }

    toPKey(key) {
        return '$' + key
    }

    getKey(sprite) {
        return this.options.key !== '*' ? this.options.key(sprite) : Helper.generateId()
    }

    setDirty(status = true) {
        this.status.dirty = !!status
    }

    getKeyIndex(key) {
        let target = this.get(key)
        if (target) {
            return this.items.findIndex(sprite => sprite === target)
        }
        this.$systemError('getKeyIndex', `Key(${key}) not found.`)
    }

    generateSprite(source) {
        return Helper.isSprite(source) ? source : this.base.create(this.customOptions).unit.$born(source)
    }

    forEach(callback) {
        let length = this.items.length
        for (let index = 0; index < length; index++) {
            let result = callback(this.items[index], index)
            if (result === '_break') {
                break
            }
        }
    }

    isChange() {
        let changed = false
        this.forEach((sprite) => {
            if (sprite.$isChange()) {
                changed = true
                return '_break'
            }
        })
        return changed
    }

    validateAll() {
        let length = this.items.length
        let result = new Array(length)
        let success = true
        this.forEach((sprite, index) => {
            result[index] = sprite.$validate()
            if (result[index].success === false) {
                success = false
            }
        })
        return { success, result }
    }

    getBodys() {
        let length = this.items.length
        let output = new Array(length)
        this.forEach((sprite, index) => {
            output[index] = sprite.$body()
        })
        return output
    }

    getOrigins() {
        let length = this.items.length
        let output = new Array(length)
        this.forEach((sprite, index) => {
            output[index] = sprite.$toOrigin()
        })
        return output
    }

    getExports(name, args) {
        let length = this.items.length
        let output = new Array(length)
        this.forEach((sprite, index) => {
            output[index] = sprite.$export(name, ...args)
        })
        return output
    }

    distortion(name) {
        this.forEach((sprite) => {
            sprite.$dist(name)
        })
    }

    put(key, sprite) {
        sprite.parent = this.parent
        if (this.has(key) === false) {
            this.items.push(sprite)
        } else {
            this.items.splice([this.getKeyIndex(key)], 1, sprite)
        }
        this.map[this.toPKey(key)] = sprite
    }

    has(key) {
        return !!this.get(key)
    }

    get(key) {
        return this.map[this.toPKey(key)]
    }

    /**
     * Trigger if data is reject written to the collection.
     * @event Collection#$writeReject
     * @property {object} context
     * @property {object} content
     * @property {object} content.message
     * @property {string} content.key
     * @property {sprite} content.sprite
     * @property {object} content.source source data
     */

    /**
     * Trigger if data is written to the collection.
     * @event Collection#$writeSuccess
     * @property {object} context
     * @property {object} content
     * @property {string} content.key
     * @property {sprite} content.sprite
     * @property {object} content.source source data
     */

    write(source, options = {}) {
        let type = typeof source
        if (type !== 'object') {
            this.$devError('write', 'Source not a object.')
        }
        let sprite = this.generateSprite(source)
        let key = this.getKey(sprite)
        if (this.base.isUs(sprite) === false) {
            this.$devError('write', `Source not a ${this.base.name} sprite.`)
        }
        if (Helper.getType(key) !== 'string') {
            this.$devError('write', `Write key(${key}) not a string`)
        }
        let eventData = { key, sprite, source, onlyKey: !!options.onlyKey }
        this.status.dirty = true
        this.options.write({
            key,
            sprite,
            reject: message => this.event.emit(this.unit, '$writeReject', [{ message, ...eventData }]),
            success: () => {
                this.put(key, sprite)
                this.event.emit(this.unit, '$writeSuccess', [eventData])
                if (this.options.writeAfter) {
                    this.options.writeAfter({ key, sprite })
                }
            }
        })
    }

    batchWrite(items) {
        if (Array.isArray(items) === false) {
            this.$devError('batchWrite', 'Data not a array.')
        }
        this.status.dirty = true
        for (let item of items) {
            this.write(item)
        }
    }

    batchWriteOnlyKeys(key, items) {
        if (Array.isArray(items) === false) {
            this.$devError('batchWriteOnlyKeys', 'Data not a array.')
        }
        this.status.dirty = true
        for (let item of items) {
            this.write({ [key]: item }, { onlyKey: true })
        }
    }

    /**
     * Trigger if batchWriteAsync write all items to the collection.
     * @event Collection#$writeAsyncDone
     * @property {object} context
     */

    batchWriteAsync(items, ms, parallel) {
        this.status.dirty = true
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                for (let i = 0; i < parallel; i++) {
                    let item = items.shift()
                    if (item) {
                        this.write(item)
                    } else {
                        clearInterval(interval)
                        resolve(true)
                        this.event.emit(this.unit, '$writeAsyncDone')
                        break
                    }
                }
            }, ms)
        })
    }

    /**
     * Get and has a sprite to trigger.
     * @event Collection#$fetch
     * @property {object} context
     * @property {sprite} sprite
     */

    /**
     * Get and result is a null to trigger.
     * @event Collection#$fetchFail
     * @property {object} context
     * @property {string} key
     */

    fetch(key) {
        let sprite = this.get(key)
        if (sprite) {
            this.event.emit(this.unit, '$fetch', [sprite])
        } else {
            this.event.emit(this.unit, '$fetchFail', [key])
        }
        return sprite
    }

    /**
     * Trigger from clear method.
     * @event Collection#$clear
     * @property {object} context
     */

    clear() {
        this.event.emit(this.unit, '$clear', [])
        this.map = {}
        this.items = []
    }

    remove(key) {
        if (this.has(key)) {
            this.items.splice(this.getKeyIndex(key), 1)
            delete this.map[this.toPKey(key)]
        } else {
            this.$devError('remove', `Key(${key}) not found.`)
        }
    }
}

module.exports = CollectionUnit

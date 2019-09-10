const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const Collection = require('./Collection')

class CollectionUnit extends Base {
    constructor(base) {
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
        this.options = Helper.verify(base.options.collection, {
            key: [false, ['function', 'string'], '*'],
            write: [false, ['function'], ({ success }) => { success() }],
            views: [false, ['object'], {}]
        })
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
        return Helper.isSprite(source) ? source : this.base.create().unit.$born(source)
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
     * 寫入資料被拒絕時觸發
     * @event Collection#$writeReject
     * @property {object} context
     * @property {object} content
     * @property {object} content.message 錯誤訊息
     * @property {string} content.key key
     * @property {sprite} content.sprite 精靈
     * @property {object} content.source 原資料
     */

    /**
     * 寫入資料成功被觸發
     * @event Collection#$writeSuccess
     * @property {object} context
     * @property {object} content
     * @property {string} content.key key
     * @property {sprite} content.sprite 精靈
     * @property {object} content.source 原資料
     */

    write(source) {
        if (Helper.getType(source) !== 'object') {
            this.$devError('write', 'Source not a object')
        }
        let sprite = this.generateSprite(source)
        let key = this.getKey(sprite)
        if (this.base.isUs(sprite) === false) {
            this.$devError('write', `Source not a ${this.base.name} sprite.`)
        }
        if (Helper.getType(key) !== 'string') {
            this.$devError('write', `Write key(${key}) not a string`)
        }
        let eventData = { key, sprite, source }
        this.status.dirty = true
        this.options.write.call(this.unit, {
            key,
            sprite,
            reject: message => this.event.emit(this.unit, '$writeReject', [{ message, ...eventData }]),
            success: () => {
                this.put(key, sprite)
                this.event.emit(this.unit, '$writeSuccess', [eventData])
            }
        })
    }

    batchWrite(items) {
        if (Helper.getType(items) !== 'array') {
            this.$devError('batchWrite', 'Data not a array.')
        }
        this.status.dirty = true
        for (let item of items) {
            this.write(item)
        }
    }

    /**
     * 寫入資料成功被觸發
     * @event Collection#$writeAsyncDone
     * @property {object} context
     */

    batchWriteAsync(items, ms = 10) {
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                let item = items.shift()
                if (item) {
                    this.write(item)
                } else {
                    clearInterval(interval)
                    resolve(true)
                    this.event.emit(this.unit, '$writeAsyncDone')
                }
            }, ms)
        })
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
        let sprite = this.get(key)
        if (sprite) {
            this.event.emit(this.unit, '$fetch', [sprite])
        } else {
            this.event.emit(this.unit, '$fetchFail', [key])
        }
        return sprite
    }

    clear() {
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

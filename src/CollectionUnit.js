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
        this.status = {
            dirty: false
        }
        this.options = Helper.verify(base.options.collection, {
            key: [false, ['function', 'string'], '*'],
            write: [false, ['function'], ({ success }) => { success() }]
        })
    }

    toPKey(key) {
        return '$' + key
    }

    getKeyIndex(key) {
        let target = this.get(key)
        if (target) {
            return this.items.findIndex(sprite => sprite === target)
        }
        this.$systemError('getKeyIndex', `Key(${key}) not found.`)
    }

    put(key, sprite) {
        if (this.has(key) === false) {
            this.items.push(sprite)
        } else {
            this.items[this.getKeyIndex(key)] = sprite
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
        let sprite = Helper.isSprite(source) ? source : this.base.create().unit.$born(source)
        let key = this.options.key !== '*' ? this.options.key(sprite) : Helper.generateId()
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
            this.event.emit(this.unit, '$fetch', [ sprite ])
        } else {
            this.event.emit(this.unit, '$fetchFail', [ key ])
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

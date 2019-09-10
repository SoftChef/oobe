const Base = require('./Base')
const Event = require('./Event')
const Sprite = require('./Sprite')
const Helper = require('./Helper')

class SpriteUnit extends Base {
    constructor(base) {
        super('Sprite')
        this.body = {}
        this.refs = {}
        this.soul = null
        this.from = null
        this.base = base
        this.dist = base.dists.read
        this.views = null
        this.parent = null
        this.options = base.options
        this.rawBody = ''
        this.rawData = null
        this.functions = null
        this.propertyNames = []
        this.init()
    }

    dataParse(data = null) {
        return JSON.parse(data)
    }

    dataStringify(data) {
        return JSON.stringify(data)
    }

    getBody() {
        let output = Helper.jpjs(this.body)
        this.eachRefs((taget, key, type) => {
            if (type === 'collection') {
                output[key] = taget.getBodys()
            } else {
                output[key] = taget.getBody()
            }
        })
        return output
    }

    getKeys() {
        let refs = Object.keys(this.base.options.refs)
        return this.propertyNames.concat(refs)
    }

    getErrorMessage() {
        return this.base.options.errorMessage(this.status.error)
    }

    getProperty(name) {
        if (this.propertyNames.includes(name)) {
            return this.unit[name]
        } else {
            this.$devError('getProperty', `Property name(${name}) not found.`)
        }
    }

    isLive() {
        if (this.status.live === false) {
            this.$devError('isLive', 'This Sprite is dead.')
            return false
        }
        if (this.isError()) {
            this.$devError('isLive', 'This Sprite is error.')
            return false
        }
        return true
    }

    isReady() {
        return !!this.status.ready
    }

    isError() {
        return !!this.status.error
    }

    isInitialization() {
        return !!this.status.init
    }

    isChange(key) {
        if (key && this.getProperty(key)) {
            let target = this.unit[key]
            if (Helper.isSprite(target)) {
                return target.isChange()
            } else {
                return target !== this.dataParse(this.rawBody)[key]
            }
        } else {
            let change = this.rawBody !== this.dataStringify(this.body)
            if (change) return true
            this.eachRefs((target) => {
                change = target.isChange()
                if (change) {
                    return '_break'
                }
            })
            return change
        }
    }

    /**
     * 呼叫export時觸發
     * @event Sprite#$export
     * @property {object} context
     */

    export(name, args) {
        let dist = null
        if (name) {
            dist = this.base.dists[name]
            if (dist == null) {
                this.$devError('export', `Dist(${name}) not found.`)
            }
        } else {
            dist = this.dist
        }
        let result = dist.options.export.apply(this.unit, args)
        this.event.emit(this.unit, '$export', [{ result, dist: dist.name }])
        return result
    }

    toOrigin() {
        return this.options.origin.call(this.unit)
    }

    out() {
        if (this.isLive()) {
            this.soul = this.copy()
            this.soul.from = this
            this.sleep()
            return this.soul
        }
    }

    sleep() {
        this.status.live = false
        this.eachRefs((target, key, type) => {
            if (type === 'sprite') {
                target.sleep()
            } else {
                target.forEach((sprite) => {
                    sprite.sleep()
                })
            }
        })
    }

    wakeup() {
        this.status.live = true
        this.eachRefs((target, key, type) => {
            if (type === 'sprite') {
                target.wakeup()
            } else {
                target.forEach((sprite) => {
                    sprite.wakeup()
                })
            }
        })
    }

    revive() {
        if (this.isLive()) {
            if (this.from) {
                this.from.reborn(this.toOrigin())
                return this.dead()
            } else {
                this.$devError('revive', 'This Sprite is root.')
            }
        }
    }

    copy() {
        if (this.isReady()) {
            return this.base.create().born(this.toOrigin()).distortion(this.dist.name)
        } else {
            this.$devError('copy', 'Sprite not ready.')
        }
    }

    dead() {
        if (this.isLive()) {
            let from = this.from
            if (this.from) {
                this.from.wakeup()
                this.from.soul = null
                this.from = null
                this.sleep()
                return from
            } else {
                this.$devError('dead', 'This Sprite is root.')
            }
        }
    }

    reborn(origin) {
        this.wakeup()
        this.setBody(origin)
    }

    reset(key) {
        if (this.isLive()) {
            if (key) {
                if (this.getProperty(key)) {
                    this.unit[key] = this.dataParse(this.rawBody)[key]
                }
            } else {
                this.setBody(this.dataParse(this.rawData))
            }
        }
    }

    setBody(data) {
        let reborn = this.options.born.call(this.unit, data) || {}
        for (let key of this.propertyNames) {
            this.unit[key] = reborn[key] === undefined ? this.unit[key] : reborn[key]
        }
        this.eachRefs((target, key, type) => {
            if (type === 'sprite') {
                target.isReady() ? target.setBody(reborn[key]) : target.born(reborn[key])
            } else {
                target.clear()
                if (reborn[key]) {
                    target.batchWrite(reborn[key])
                }
            }
        })
        this.unit.$self = this.base.options.self.call(this.unit, data)
    }

    /**
     * 呼叫setError時觸發
     * @event Sprite#$error
     * @property {object} context
     * @property {*} errorData
     */

    setError(data) {
        this.status.error = data || 'Unknown error'
        this.event.emit(this.unit, '$error', [data])
    }

    put(data) {
        if (this.isLive()) {
            for (let key of this.propertyNames) {
                if (data[key] !== undefined) {
                    this.unit[key] = data[key]
                }
            }
            this.eachRefs((target, key, type) => {
                if (type === 'sprite') {
                    if (data[key] !== undefined) {
                        target.put(data[key])
                    }
                } else {
                    if (Array.isArray(data[key])) {
                        target.clear()
                        for (let body of data[key]) {
                            target.write(target.generateSprite({}).$put(body))
                        }
                    }
                }
            })
        }
        return this
    }

    eachRefs(callback) {
        for (let key in this.refs) {
            let type = this.refs[key] instanceof SpriteUnit ? 'sprite' : 'collection'
            let result = callback(this.refs[key], key, type)
            if (result === '_break') {
                break
            }
        }
    }

    distortion(name) {
        if (this.isLive()) {
            if (this.base.dists[name] == null) {
                return this.$devError('distortion', `Name(${name}) not found.`)
            }
            this.dist = this.base.dists[name]
            this.eachRefs((target) => {
                target.distortion(name)
            })
            return this
        }
    }

    bind(name) {
        let target = this.functions[name]
        if (target == null) {
            return this.$devError('bind', `Method(${name}) not found`)
        }
        return this.functions[name].bind(this.functions)
    }

    /**
     * 呼叫born時觸發
     * @event Sprite#$ready
     * @property {object} context
     */

    born(data) {
        if (this.isReady()) {
            this.$devError('born', 'Sprite is ready.')
        }
        if (this.isLive()) {
            this.setBody(data)
            this.rawBody = this.dataStringify(this.body)
            this.rawData = this.dataStringify(data)
            this.base.options.created.call(this.unit)
            this.status.ready = true
            this.event.emit(this.unit, '$ready')
            return this
        }
    }

    toObject() {
        let object = this.getBody()
        object.$self = {}
        object.$views = {}
        object.$status = Helper.jpjs(this.status)
        for (let key in this.unit.$self) {
            object.$self[key] = this.unit.$self[key]
        }
        for (let key in this.base.options.views) {
            object.$views[key] = this.views[key]
        }
        return object
    }

    init() {
        this.initUnit()
        this.initBody()
        this.checkBody()
        this.initEvent()
        this.initStatus()
        this.rawBody = this.dataStringify(this.body)
        this.rawData = null
        this.propertyNames = Object.keys(this.body || {})
        this.status.init = true
    }

    initEvent() {
        this.event = new Event('unit', this.base.event)
    }

    initStatus() {
        this.status = {
            live: true,
            init: false,
            error: null,
            ready: false
        }
    }

    initUnit() {
        this.unit = new Sprite(this)
        this.functions = this.base.getMethods(this.unit)
        if (this.base.options.defaultView && typeof Proxy !== 'undefined') {
            let defaultView = this.base.options.defaultView
            this.views = new Proxy(this.base.getViews(this.unit), {
                get: (target, key) => {
                    let value = null
                    if (target[key]) {
                        value = target[key]
                    }
                    if (!value) {
                        value = defaultView.call(this.unit, { key })
                    }
                    return value
                }
            })
        } else {
            this.views = this.base.getViews(this.unit)
        }
    }

    initBody() {
        let refs = this.options.refs
        let body = this.options.body.call(this.unit)
        for (let key in body) {
            this.body[key] = body[key]
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('body', key),
                set: this.setDefineProperty(key)
            })
        }
        for (let key in refs) {
            let name = refs[key]
            if (name[0] === '[' && name.slice(-1) === ']') {
                this.refs[key] = this.base.container.makeCollection(name.slice(1, -1))
            } else {
                this.refs[key] = this.base.container.make(name)
            }
            this.refs[key].parent = this.unit
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('refs', key),
                set: this.setDefineProperty(key, true)
            })
        }
    }

    checkBody() {
        for (let key in this.body) {
            let value = this.body[key]
            let type = Helper.getType(value)
            if (type === 'function') {
                this.$devError('checkBody', `Body ${key} can't be a function.`)
            }
            if (key[0] === '$' || key[0] === '_') {
                this.$devError('checkBody', `Body ${key} has system symbol $ and _.`)
            }
        }
    }

    getRules(name, extra = []) {
        let rules = this.base.options.rules[name]
        if (rules == null) {
            this.$devError('getRules', `Rule name(${name}) not found.`)
        }
        return this.base.container.getRules(this.unit, rules.concat(extra))
    }

    getRawdata(assign) {
        let data = this.dataParse(this.rawData)
        return assign ? Helper.deepObjectAssign(data, assign) : data
    }

    validate(value, name) {
        let rules = this.base.options.rules[name]
        return this.base.container.validate(this.unit, value, rules)
    }

    validateAll() {
        let keys = Object.keys(this.base.options.rules)
        let result = {}
        let success = true
        for (let name of keys) {
            let value = this.unit[name]
            let check = this.validate(value, name)
            if (check !== true) {
                result[name] = check
                success = false
            }
        }
        this.eachRefs((target, key) => {
            result[key] = target.validateAll()
            if (result[key].success === false) {
                success = false
            }
        })
        return { result, success }
    }

    getDefineProperty(name, key) {
        if (name === 'refs') {
            return () => this.refs[key].unit
        } else {
            return () => this.body[key]
        }
    }

    setDefineProperty(key, protect) {
        return (value) => {
            if (this.isLive() === false) {
                return this.$devError('set', 'This Sprite is dead.')
            }
            if (protect) {
                return this.$devError('set', `This property(${key}) is protect.`)
            }
            this.body[key] = value
        }
    }
}

module.exports = SpriteUnit

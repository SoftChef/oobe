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
        this.state = base.states.read
        this.options = base.options
        this.rawBody = ''
        this.rawData = null
        this.propertyNames = []
        this.init()
    }

    dataParse(data = null) {
        return JSON.parse(data)
    }

    dataStringify(data) {
        return JSON.stringify(data) || ''
    }

    getBody() {
        let output = Helper.jpjs(this.body)
        this.eachRefs((ref, key) => {
            output[key] = ref.getBody()
        })
        return output
    }

    getKeys() {
        let refs = Object.keys(this.base.options.refs)
        return this.propertyNames.concat(refs)
    }

    getProperty(name) {
        if (this.propertyNames.includes(name)) {
            return this.unit[name]
        } else {
            this.$systemError('getProperty', `Property name(${name}) not found.`)
        }
    }

    isLive() {
        if (this.status.live === false) {
            this.$systemError('isLive', 'This Sprite is dead.')
            return false
        }
        return true
    }

    isReady() {
        return !!this.status.ready
    }

    isReference() {
        return !!this.status.reference
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
            this.eachRefs((sprite) => {
                change = sprite.isChange()
                if (change) {
                    return '_break'
                }
            })
            return change
        }
    }

    export(name) {
        let state = null
        if (name) {
            state = this.base.states[name]
            if (state == null) {
                this.$systemError('export', `State(${name}) not found.`)
            }
        } else {
            state = this.state
        }
        return state.options.export.call(this.unit)
    }

    toOrigin() {
        let output = this.options.origin.call(this.unit)
        this.eachRefs((ref, key) => {
            output[key] = ref.toOrigin()
        })
        return output
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
        this.eachRefs(s => s.sleep())
    }

    wakeup() {
        this.status.live = true
        this.eachRefs(s => s.wakeup())
    }

    revive() {
        if (this.isLive()) {
            if (this.from) {
                this.from.reborn(this.toOrigin())
                return this.dead()
            } else {
                this.$systemError('revive', 'This Sprite is root.')
            }
        }
    }

    copy() {
        if (this.isReady()) {
            return this.base.create().born(this.toOrigin()).distortion(this.state.name)
        } else {
            this.$systemError('copy', 'Sprite no ready.')
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
                this.$systemError('dead', 'This Sprite is root.')
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
        this.eachRefs((sprite, key) => {
            sprite.isReady() ? sprite.setBody(reborn[key]) : sprite.born(reborn[key])
        })
        this.unit.$self = this.base.options.self.call(this.unit, data)
    }

    eachRefs(callback) {
        for (let key in this.refs) {
            let result = callback(this.refs[key], key)
            if (result === '_break') {
                break
            }
        }
    }

    distortion(name) {
        if (this.isLive()) {
            if (this.base.states[name] == null) {
                return this.$systemError('distortion', `Name(${name}) not found.`)
            }
            this.state = this.base.states[name]
            this.eachRefs(s => s.distortion(name))
            return this
        }
    }

    bind(name) {
        let target = this.unit.$fn[name]
        if (target == null) {
            return this.$systemError('bind', `Method(${name}) not found`)
        }
        return this.unit.$fn[name].bind(this.unit.$fn)
    }

    born(data) {
        if (this.isReady()) {
            this.$systemError('born', 'Sprite is ready.')
        }
        if (this.isLive()) {
            this.setBody(data)
            this.rawBody = this.dataStringify(this.body)
            this.rawData = this.dataStringify(data)
            this.base.options.created.call(this.unit)
            this.status.ready = true
            return this
        }
    }

    init() {
        this.initUnit()
        this.initBody()
        this.checkBody()
        this.initEvent()
        this.initStatus()
        this.rawBody = this.dataStringify(this.body)
        this.rawData = this.dataStringify(this.toOrigin())
        this.propertyNames = Object.keys(this.body)
        this.status.init = true
    }

    initEvent() {
        this.event = new Event('sprite', this.base.event, {})
    }

    initStatus() {
        this.status = {
            live: true,
            init: false,
            ready: false,
            reference: false
        }
    }

    initUnit() {
        this.unit = new Sprite(this)
        this.unit.$fn = this.base.getMethods(this.unit)
        this.unit.$views = {}
        for (let key in this.base.options.views) {
            Object.defineProperty(this.unit.$views, key, {
                get: this.base.options.views[key].bind(this.unit)
            })
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
            this.refs[key] = this.base.container.make(refs[key])
            this.refs[key].status.reference = true
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
                this.$systemError('checkBody', `Body ${key} can't be a function.`)
            }
            if (key[0] === '$' || key[0] === '_') {
                this.$systemError('checkBody', `Body ${key} has system symbol $ and _.`)
            }
        }
    }

    getRules(name, extra = []) {
        let rules = this.base.options.rules[name]
        if (rules == null) {
            this.$systemError('getRules', `Rule name(${name}) not found.`)
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

    validateAll(target) {
        let keys = Object.keys(this.base.options.rules)
        let result = {}
        let success = true
        for (let name of keys) {
            let value = target[name]
            let check = this.validate(value, name)
            if (check !== true) {
                result[name] = check
                success = false
            }
        }
        this.eachRefs((sprite, name) => {
            result[name] = sprite.validateAll(target[name])
            if (result[name].success !== true) {
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
                return this.$systemError('set', 'This Sprite is dead.')
            }
            if (protect) {
                return this.$systemError('set', `This property(${key}) is protect.`)
            }
            this.body[key] = value
        }
    }

    on(channelName, name, callback) {
        this.event.on(channelName, name, callback)
    }

    off(channelName, name) {
        this.event.off(channelName, name)
    }

    emit(channelName, params) {
        this.event.emit(this.sprite, channelName, params)
    }
}

module.exports = SpriteUnit

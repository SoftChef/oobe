const Base = require('./Base')
const Unit = require('./Unit')
const Helper = require('./Helper')

class Sprite extends Base {
    constructor(base, data, reference) {
        super('Sprite')
        this.body = {}
        this.refs = {}
        this.soul = null
        this.from = null
        this.base = base
        this.state = base.states.read
        this.watch = base.options.watch
        this.options = base.options
        this.rawBody = ''
        this.rawData = ''
        this.reference = !!reference
        this.propertyNames = []
        this.init(data)
    }

    getBody() {
        let output = Helper.deepClone(this.body)
        this.eachRefs((ref, key) => {
            output[key] = ref.getBody()
        })
        return output
    }

    getKeys() {
        return this.propertyNames
            .concat(Object.keys(this.base.options.refs))
            .concat(Object.keys(this.base.options.computed))
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
        return !!this.status.init
    }

    isChange() {
        let change = this.rawBody !== JSON.stringify(this.body)
        if (change) return true
        this.eachRefs((sprite) => {
            change = sprite.isChange()
            if (change) {
                return '_break'
            }
        })
        return change
    }

    isReference() {
        return !!this.reference
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

    getUnit() {
        return this.unit
    }

    toOrigin() {
        return this.options.origin.call(this.unit)
    }

    out() {
        if (this.isLive()) {
            this.soul = this.base.create(this.toOrigin())
            this.soul.distortion(this.state.name)
            this.soul.from = this
            this.sleep()
            return this.soul.getUnit()
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
        return this.base.create(this.toOrigin()).distortion(this.state.name)
    }

    dead() {
        if (this.isLive()) {
            if (this.from) {
                let from = this.from
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

    reset() {
        if (this.isLive()) {
            this.setBody(JSON.parse(this.rawData))
        }
    }

    setBody(data) {
        let reborn = this.options.reborn.call(this.unit, data)
        for (let key of this.propertyNames) {
            this.unit[key] = reborn[key] === undefined ? this.unit[key] : reborn[key]
        }
        this.eachRefs((sprite, key) => {
            sprite.setBody(reborn[key])
        })
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
            return this.getUnit()
        }
    }

    init(data) {
        this.initUnit()
        this.initBody(data)
        this.initStatus()
        this.initComputed()
        this.rawBody = JSON.stringify(this.body)
        this.rawData = JSON.stringify(data)
        this.propertyNames = Object.keys(this.body)
        this.base.options.create.call(this.getUnit())
        this.status.init = true
    }

    initStatus() {
        this.status = {
            live: true,
            init: false
        }
    }

    initUnit() {
        this.unit = new Unit(this)
        this.unit.$fn = this.getMethods()
    }

    initBody(data) {
        let refs = this.options.refs
        let body = this.options.body.call(this.unit)
        let reborn = this.options.reborn.call(this.unit, data)
        for (let key in body) {
            this.body[key] = reborn[key] === undefined ? body[key] : reborn[key]
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('body', key),
                set: this.setDefineProperty(key)
            })
        }
        for (let key in refs) {
            this.refs[key] = this.base.container.make(refs[key], reborn[key])
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('refs', key),
                set: this.setDefineProperty(key, true)
            })
        }
    }

    initComputed() {
        let data = this.base.options.computed
        for (let key in data) {
            Object.defineProperty(this.unit, key, {
                get: data[key].get ? data[key].get.bind(this.unit) : () => {},
                set: data[key].set ? data[key].set.bind(this.unit) : (val) => {}
            })
        }
    }

    getMethods() {
        let fn = {}
        let containerMethods = this.base.container.options.methods
        for (let key in containerMethods) {
            fn[key] = containerMethods[key].bind(this.unit)
        }
        let methods = this.base.options.methods
        for (let key in methods) {
            fn[key] = methods[key].bind(this.unit)
        }
        return fn
    }

    getRules(name, extra = []) {
        let rules = this.base.options.rules[name]
        if (rules == null) {
            this.$systemError('getRules', `Rule name(${name}) not found.`)
        }
        return this.base.container.getRules(this.unit, rules.concat(extra))
    }

    validate(name) {
        let value = this.getProperty(name)
        let rules = this.base.options.rules[name]
        return this.base.container.validate(this.unit, value, rules)
    }

    validateAll() {
        let names = Object.keys(this.base.options.rules)
        for (let name of names) {
            output[name] = this.validate(name)
        }
        this.eachRefs((sprite, name) => {
            output[name] = sprite.validateAll()
        })
        return output
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
            if (this.isReady() && this.watch[key]) {
                this.watch[key].call(this.unit, this.body[key], value)
            }
            this.body[key] = value
        }
    }
}

module.exports = Sprite

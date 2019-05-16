const Base = require('./Base')
const Unit = require('./Unit')
const Helper = require('./Helper')

class Sprite extends Base {
    constructor(base, data) {
        super('Sprite')
        this.unit = new Unit()
        this.body = {}
        this.refs = {}
        this.soul = null
        this.live = true
        this.from = null
        this.base = base
        this.fixed = []
        this.state = null
        this.options = base.options
        this.rawBody = ''
        this.rawData = JSON.stringify(data)
        this.ignoreFixed = false
        this.propertyNames = []
        this.init()
        this.distortion('read')
    }

    getBody() {
        let output = Helper.deepClone(this.body)
        this.eachRefs((ref, key) => {
            output[key] = ref.getBody()
        })
        return output
    }

    getKeys() {
        return this.propertyNames.concat(Object.keys(this.base.options.refs))
    }

    getProperty(name) {
        if (this.propertyNames.includes(name)) {
            return this.unit[name]
        } else {
            this.$systemError('getProperty', `Property name(${name}) not found.`)
        }
    }

    isFixed(name) {
        if (this.ignoreFixed) return false
        if (this.fixed === '*') return true
        return this.fixed.includes(name)
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
        if (this.live === false) this.$systemError('out', 'This Sprite is dead.')
        this.soul = this.base.createSprite(this.toOrigin())
        this.soul.distortion(this.state.name)
        this.soul.from = this
        this.sleep()
        return this.soul.getUnit()
    }

    sleep() {
        this.live = false
        this.eachRefs(s => s.sleep())
    }

    wakeup() {
        this.live = true
        this.eachRefs(s => s.wakeup())
    }

    revive() {
        let data = this.toOrigin()
        if (this.live === false) this.$systemError('revive', 'This Sprite is dead.')
        if (this.from) {
            this.from.ignoreFixed = true
            this.from.reborn(data)
            this.from.ignoreFixed = false
            this.dead()
        } else {
            this.$systemError('revive', 'This Sprite is root.')
        }
    }

    copy() {
        let sprite = this.base.createSprite(this.toOrigin())
        sprite.distortion(this.state.name)
        return sprite.getUnit()
    }

    dead() {
        if (this.live === false) this.$systemError('dead', 'This Sprite is dead.')
        if (this.from) {
            this.from.wakeup()
            this.from.soul = null
            this.from = null
            this.sleep()
        } else {
            this.$systemError('dead', 'This Sprite is root.')
        }
    }

    reborn(origin) {
        this.wakeup()
        this.resetBody(origin)
    }

    reset() {
        if (this.live === false) {
            return this.$systemError('set', 'This Sprite is dead.')
        }
        this.resetBody(JSON.parse(this.rawData))
    }

    resetBody(origin) {
        let reborn = this.setBody(origin)
        this.eachRefs((sprite, key) => {
            sprite.setBody(reborn[key])
        })
    }

    setBody(data) {
        let reborn = this.options.reborn.call(this.unit, data)
        for (let key of this.propertyNames) {
            this.unit[key] = reborn[key]
        }
        return reborn
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
        if (this.live === false) this.$systemError('distortion', 'This Sprite is dead.')
        if (this.base.states[name] == null) {
            return this.$systemError('distortion', `Name(${name}) not found.`)
        }
        this.state = this.base.states[name]
        this.fixed = this.state.options.fixed
        this.eachRefs(s => s.distortion(name))
        return this.getUnit()
    }

    init() {
        this.initUnit()
        this.initBody()
        this.rawBody = JSON.stringify(this.body)
        this.propertyNames = Object.keys(this.body)
        this.base.create.call(this.getUnit())
    }

    initUnit() {
        this.unit.$fn = this.getMethods()
        this.unit.$out = this.out.bind(this)
        this.unit.$dead = this.dead.bind(this)
        this.unit.$copy = this.copy.bind(this)
        this.unit.$body = this.getBody.bind(this)
        this.unit.$keys = this.getKeys.bind(this)
        this.unit.$reset = this.reset.bind(this)
        this.unit.$rules = this.getRules.bind(this)
        this.unit.$utils = this.base.container.options.utils
        this.unit.$helper = Helper
        this.unit.$revive = this.revive.bind(this)
        this.unit.$export = this.export.bind(this)
        this.unit.$status = this.getStatus.bind(this)
        this.unit.$configs = this.base.container.getConfigs()
        this.unit.$isFixed = this.isFixed.bind(this)
        this.unit.$toOrigin = this.toOrigin.bind(this)
        this.unit.$isChange = this.isChange.bind(this)
        this.unit.$validate = this.validateAll.bind(this)
        this.unit.$distortion = this.distortion.bind(this)
    }

    initBody() {
        let refs = this.options.refs
        let body = this.options.body.call(this.unit)
        let born = this.options.reborn.call(this.unit, JSON.parse(this.rawData))
        for (let key in body) {
            this.body[key] = born[key] === undefined ? body[key] : born[key]
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('body', key),
                set: this.setDefineProperty(key)
            })
        }
        for (let key in refs) {
            this.refs[key] = this.base.container.make(refs[key], born[key])
            Object.defineProperty(this.unit, key, {
                get: this.getDefineProperty('refs', key),
                set: this.setDefineProperty(key, true)
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

    getStatus() {
        return {
            live: this.live,
            keys: this.getKeys(),
            state: this.state.name,
            fixed: this.fixed.slice(),
            rawBody: this.rawBody,
            rawData: this.rawData
        }
    }

    getRules(name, extra = []) {
        let output = []
        let rules = this.base.options.rules[name]
        if (rules == null) {
            this.$systemError('getRules', `Rule name(${name}) not found.`)
        }
        rules = rules.concat(extra)
        for (let data of rules) {
            if (typeof data === 'function') {
                output.push(data)
            } else {
                output.push(this.base.container.getRule(data))
            }
        }
        return output
    }

    validate(name, extra) {
        let rules = this.getRules(name, extra)
        let value = this.getProperty(name)
        let errors = []
        let success = true
        for (let rule of rules) {
            let result = rule(value)
            if (result !== true) {
                success = false
                errors.push(result)
            }
        }
        return { success, errors }
    }

    validateAll() {
        let names = Object.keys(this.base.options.rules)
        let errors = {}
        let success = true
        for (let name of names) {
            let result = this.validate(name)
            if (result.success === false) {
                success = false
            }
            errors[name] = result.errors
        }
        this.eachRefs((sprite, name) => {
            let result = sprite.validateAll()
            if (result.success === false) {
                success = false
            }
            errors[name] = result.errors
        })
        return { success, errors }
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
            if (this.live === false) {
                return this.$systemError('set', 'This Sprite is dead.')
            }
            if (protect) {
                return this.$systemError('set', `This property(${key}) is protect.`)
            }
            if (this.isFixed(key)) {
                return this.$systemError('set', `This property(${key}) is fixed.`)
            }
            this.body[key] = value
        }
    }
}

module.exports = Sprite

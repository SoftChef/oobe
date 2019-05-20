const Base = require('./Base')
const Rule = require('./Rule')
const Message = require('./Message')
const Container = require('./Container')

class Core extends Base {
    constructor() {
        super('Core')
        this.rule = new Rule()
        this.message = new Message()
        this.locale = 'en-us'
        this.containers = {}
        this.addContainer('__system__', { sprites: { system: { body: () => {} } } })
        this.systemSprite = this.make('__system__', 'system')
    }

    addon(optinos) {
        let plugin = this.$verify(optinos, {
            name: [true, ['string']],
            rules: [false, ['object'], {}],
            locale: [false, ['object'], {}]
        })
        let name = '[' + plugin.name + ']'
        for (let key in plugin.rules) {
            this.addRule(name + key, plugin.rules[key])
        }
        this.message.add(plugin.locale, name)
    }

    refresh() {
        this.eachContainer((container) => {
            container.message.setLocale(this.locale)
        })
    }

    eachContainer(action) {
        for (let key in this.containers) {
            action(this.containers[key])
        }
    }

    setLocale(locale) {
        this.locale = locale
        this.refresh()
    }

    addLocale(locale) {
        this.message.add(locale)
    }

    addRule(name, rule) {
        this.rule.add(name, rule)
    }

    getRule(name) {
        return this.rule.get(name)
    }

    validate(name, value) {
        return this.getRule(name).call(this.systemSprite, value)
    }

    validates(value, array) {
        let rules = this.getRules(array)
        for (let rule of rules) {
            let result = rule.call(this.systemSprite, value)
            if (result !== true) {
                return result
            }
        }
        return true
    }

    getRules(array, bind) {
        let output = []
        for (let data of array) {
            let target = null
            if (typeof data === 'function') {
                target = data
            } else {
                target = this.getRule(data)
            }
            if (bind) {
                output.push(target.bind(bind))
            } else {
                output.push(target)
            }
        }
        return output
    }

    make(containerName, spriteName, data) {
        let container = this.containers[containerName]
        if (container == null) {
            return this.$systemError('make', `Container name(${containerName}) not found.`)
        }
        return container.make(spriteName, data).getUnit()
    }

    addContainer(name, container) {
        if (this.containers[name]) {
            return this.$systemError('addContainer', `Name(${name}) already exists.`)
        }
        this.containers[name] = new Container(this, container)
        this.refresh()
        return this.containers[name]
    }

    getConfigs(name) {
        if (this.containers[name] == null) {
            return this.$systemError('getConfigs', `Containers name(${name}) not found.`)
        }
        return this.containers[name].getConfigs()
    }
}

class Export {
    constructor() {
        let core = new Core()
        this.make = core.make.bind(core)
        this.addon = core.addon.bind(core)
        this.addRule = core.addRule.bind(core)
        this.getRules = (array) => { return core.getRules(array, core.systemSprite) }
        this.validate = core.validate.bind(core)
        this.validates = core.validates.bind(core)
        this.addLocale = core.addLocale.bind(core)
        this.setLocale = core.setLocale.bind(core)
        this.getConfigs = core.getConfigs.bind(core)
        this.addContainer = (name, data, options = {}) => {
            let container = core.addContainer(name, data)
            let configs = container.options.configs
            return container.options.install.call(this, configs, options)
        }
    }
}

module.exports = Export

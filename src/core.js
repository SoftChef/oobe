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
    }

    addon(optinos) {
        let plugin = this.$verify(optinos, {
            name: [],
            rules: {},
            locale: {}
        })
        for (let key in plugin.rules) {
            this.addRule(plugin.name + '/' + key, rules[key])
        }
        this.addLocale(plugin.locale, plugin.name)
    }

    refresh() {
        this.eachContainer((container) => {
            container.message.setlocale(this.locale)
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
        return this.getRule(name)(value)
    }

    validates(value, array) {
        let rules = this.getRules(array)
        for (let rule of rules) {
            let result = rule(value)
            if (result !== true) {
                return result
            }
        }
        return true
    }

    getRules(array) {
        let output = []
        for (let data of array) {
            if (typeof data === 'function') {
                output.push(data)
            } else {
                output.push(this.getRule(data))
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
        this.addRule = core.addRule.bind(core)
        this.addRules = core.addRules.bind(core)
        this.getRules = core.getRules.bind(core)
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

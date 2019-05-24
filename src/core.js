const Base = require('./Base')
const Rule = require('./Rule')
const Message = require('./Message')
const Configs = require('./Configs')
const Container = require('./Container')

class Core extends Base {
    constructor() {
        super('Core')
        this.rule = new Rule()
        this.locale = 'en-us'
        this.message = new Message()
        this.containers = {}
        this.init()
    }

    // ===================
    //
    // init
    //

    init() {
        this.initSystemContainer()
    }

    initSystemContainer() {
        this.addContainer('__system__', Configs.systemContainer)
        this.systemSprite = this.make('__system__', 'system')
    }

    // ===================
    //
    // plugins
    //

    addon(optinos) {
        let plugin = this.$verify(optinos, {
            name: [true, ['string']],
            rules: [false, ['object'], {}],
            locale: [false, ['object'], {}]
        })
        let name = '[' + plugin.name + ']'
        this.rule.addMultiple(plugin.rules, name)
        this.message.add(plugin.locale, name)
    }

    // ===================
    //
    // add
    //

    addRules(rules) {
        this.rule.addMultiple(rules)
    }

    addLocale(locale) {
        this.message.add(locale)
    }

    addContainer(name, container) {
        if (this.containers[name]) {
            return this.$systemError('addContainer', `Name(${name}) already exists.`)
        }
        this.containers[name] = new Container(this, container)
        this.refresh()
        return this.containers[name]
    }

    // ===================
    //
    // get
    //

    getRules(array) {
        return this.rule.getMore(array, this.systemSprite)
    }

    // ===================
    //
    // set
    //

    setLocale(locale) {
        this.locale = locale
        this.refresh()
    }

    // ===================
    //
    // methods
    //

    refresh() {
        this.eachContainer((container) => {
            container.message.setLocale(this.locale)
        })
    }

    validate(value, array) {
        let rules = this.getRules(array)
        for (let rule of rules) {
            let result = rule(value)
            if (result !== true) {
                return result
            }
        }
        return true
    }

    eachContainer(action) {
        for (let key in this.containers) {
            action(this.containers[key])
        }
    }

    // ===================
    //
    // public
    //

    make(containerName, spriteName, target) {
        let container = this.containers[containerName]
        if (container == null) {
            return this.$systemError('make', `Container name(${containerName}) not found.`)
        }
        return container.make(spriteName, target).getUnit()
    }

    mult(containerName, spriteName, target) {
        let output = []
        for (let data of target) {
            output.push(this.make(containerName, spriteName, data))
        }
        return output
    }
}

module.exports = Core

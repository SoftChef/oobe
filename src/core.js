const Base = require('./Base')
const Rule = require('./Rule')
const Message = require('./Message')
const Configs = require('./Configs')
const Container = require('./Container')

class Core extends Base {
    constructor() {
        super('Core')
        this.rule = new Rule()
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
        this.containers[name] = new Container(this, name, container)
        return this.containers[name]
    }

    // ===================
    //
    // get
    //

    getRules(array) {
        return this.rule.getMore(this.systemSprite, array)
    }

    // ===================
    //
    // set
    //

    setLocale(locale) {
        this.message.setLocale(locale)
    }

    // ===================
    //
    // methods
    //

    validate(value, array) {
        return this.rule.validate(this.systemSprite, value, array)
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

    make(containerName, spriteName, data) {
        let container = this.containers[containerName]
        if (container == null) {
            return this.$systemError('make', `Container name(${containerName}) not found.`)
        }
        return container.make(spriteName, data).getUnit()
    }

    mult(containerName, spriteName, data) {
        let output = []
        for (let item of data) {
            output.push(this.make(containerName, spriteName, item))
        }
        return output
    }
}

module.exports = Core

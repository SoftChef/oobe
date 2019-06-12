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
        this.bridge = null
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

    getPrefix(name) {
        if (name === '') {
            this.$systemError('getPrefix', `This name(${name}) is empty.`)
        }
        if (Configs.protectPrefix.includes(name) === true) {
            this.$systemError('getPrefix', `This name(${name}) is protect.`)
        }
        return '#' + name + '.'
    }

    addon(optinos) {
        let plugin = this.$verify(optinos, {
            name: [true, ['string']],
            rules: [false, ['object'], {}],
            locales: [false, ['object'], {}]
        })
        let prefix = this.getPrefix(plugin.name)
        this.rule.addMultiple(plugin.rules, prefix)
        this.message.add(plugin.locales, prefix)
    }

    // ===================
    //
    // add
    //

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

    setBridge(bridge) {
        if (Helper.getType(bridge) !== 'function') {
            return this.$systemError('setBridge', 'Arg not a function')
        }
        this.bridge = bridge
    }

    // ===================
    //
    // methods
    //

    eachContainer(action) {
        for (let key in this.containers) {
            action(this.containers[key])
        }
    }

    // ===================
    //
    // public
    //

    make(containerName, spriteName) {
        if (this.bridge) {
            this.bridge(this, containerName, spriteName)
        }
        let container = this.containers[containerName]
        if (container == null) {
            return this.$systemError('make', `Container name(${containerName}) not found.`)
        }
        return container.make(spriteName).unit
    }

    batch(containerName, spriteName, data) {
        let type = Helper.getType(data)
        let output = []
        if (type === 'array') {
            data.forEach((d) => {
                output.push(this.make(containerName, spriteName).$born(d))
            })
            return output
        } else {
            this.$systemError('batch', 'Data must be a array.', data)
        }
    }
}

module.exports = Core

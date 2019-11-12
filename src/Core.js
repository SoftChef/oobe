const Base = require('./Base')
const Rule = require('./Rule')
const Event = require('./Event')
const Helper = require('./Helper')
const Message = require('./Message')
const Configs = require('./Configs')
const Container = require('./Container')

class Core extends Base {
    constructor(oobe) {
        super('Core')
        this.oobe = oobe
        this.rule = new Rule()
        this.plugins = []
        this.message = new Message()
        this.containers = {}
        this.init()
    }

    init() {
        this.initEvent()
        this.initSystemContainer()
    }

    initEvent() {
        this.event = new Event('core')
    }

    initSystemContainer() {
        this.addContainer('__system__', Configs.systemContainer)
        this.systemSprite = this.make('__system__', 'system')
    }

    getPrefix(name) {
        if (name === '') {
            this.$devError('getPrefix', `This name(${name}) is empty.`)
        }
        if (Configs.protectPrefix.includes(name) === true) {
            this.$devError('getPrefix', `This name(${name}) is protect.`)
        }
        return '#' + name + '.'
    }

    addon(optinos) {
        let plugin = Helper.verify(optinos, {
            name: [true, ['string']],
            rules: [false, ['object'], {}],
            locales: [false, ['object'], {}]
        })
        let prefix = this.getPrefix(plugin.name)
        this.rule.addMultiple(plugin.rules, prefix)
        this.message.add(plugin.locales, prefix)
    }

    addContainer(name, container) {
        if (this.containers[name]) {
            return this.$devError('addContainer', `Name(${name}) already exists.`)
        }
        this.containers[name] = new Container(this, name, container)
        return this.containers[name]
    }

    getRules(array) {
        return this.rule.getMore(this.systemSprite, array)
    }

    setLocale(locale) {
        this.message.setLocale(locale)
    }

    plugin(Plugin) {
        if (this.plugins.includes(Plugin)) {
            return this.$devError('plugin', 'The patch has been registered')
        }
        this.plugins.push(Plugin)
        return new Plugin(this.oobe)
    }

    eachContainer(action) {
        for (let key in this.containers) {
            action(this.containers[key])
        }
    }

    instanceof(containerName, name, target) {
        if (Helper.isSprite(target) === false) {
            this.$devError('instanceof', 'Target not a sprite.')
        }
        let container = target._container
        let spriteBase = target._sprite.base
        let targetContainer = this.containers[containerName]
        if (targetContainer == null) {
            this.$devError('instanceof', `Container(${containerName}) not found`)
        }
        let targetSpriteBase = targetContainer.spriteBases[name]
        if (targetSpriteBase == null) {
            this.$devError('instanceof', `Sprite(${containerName}) not found`)
        }
        return container === targetContainer && spriteBase === targetSpriteBase
    }

    make(containerName, spriteName) {
        let container = this.containers[containerName]
        if (container == null) {
            return this.$devError('make', `Container name(${containerName}) not found.`)
        }
        return container.make(spriteName).unit
    }

    batch(containerName, spriteName, items) {
        let type = Helper.getType(items)
        let output = []
        if (type !== 'array') {
            this.$devError('batch', 'Data must be a array.', data)
        }
        items.forEach((item) => {
            output.push(this.make(containerName, spriteName).$born(item))
        })
        return output
    }

    makeCollection(containerName, spriteName) {
        let container = this.containers[containerName]
        if (container == null) {
            return this.$devError('makeCollection', `Container name(${containerName}) not found.`)
        }
        return container.makeCollection(spriteName).unit
    }
}

module.exports = Core

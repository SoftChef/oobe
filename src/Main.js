const Core = require('./Core')
const Unit = require('./Unit')

class Main {
    constructor() {
        this._core = new Core()
    }

    static isSprite(target) {
        return Unit.isSprite(target)
    }

    make(containerName, spriteName, data) {
        return this._core.make(containerName, spriteName, data)
    }

    mult(containerName, spriteName, data) {
        return this._core.mult(containerName, spriteName, data)
    }

    join(name, data, options = {}) {
        let container = this._core.addContainer(name, data)
        let configs = container.options.configs
        return container.options.install.call(this, configs, options)
    }

    addon(optinos) {
        this._core.addon(optinos)
    }

    addRules(rules) {
        this._core.addRules(rules)
    }

    validate(value, array) {
        return this._core.validate(value, array)
    }

    addLocale(locale) {
        this._core.addLocale(locale)
    }

    setLocale(locale) {
        this._core.setLocale(locale)
    }

    getRules(data) {
        return this._core.getRules(data)
    }
}

module.exports = Main

const Core = require('./Core')
const Unit = require('./Unit')

class Main {
    constructor() {
        this._core = new Core()
    }

    static isSprite(target) {
        return Unit.isSprite(target)
    }

    meg(name, value) {
        return this._core.message.get(name, value)
    }

    make(containerName, spriteName) {
        return this._core.make(containerName, spriteName)
    }

    join(name, data, options = {}) {
        let container = this._core.addContainer(name, data)
        let configs = container.options.configs
        return container.options.install.call(this, configs, options)
    }

    addon(optinos) {
        this._core.addon(optinos)
    }

    validate(value, array) {
        return this._core.validate(value, array)
    }

    setLocale(locale) {
        this._core.setLocale(locale)
    }

    getRules(data) {
        return this._core.getRules(data)
    }
}

module.exports = Main

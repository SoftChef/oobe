const Base = require('./Base')
const Core = require('./Oobe')
const Helper = require('./Helper')
const Configs = require('./Configs')

/**
 * Main export class
 */

class Oobe extends Base {
    constructor() {
        super('Oobe')
        this._core = new Core(this)
        this.helper = Helper
    }

    /**
     * Attached event handler.
     * @param {string} channelName
     * @param {object} params
     */

    on(channelName, callback) {
        return this._core.event.on(channelName, callback)
    }

    /**
     * Attached event handler, but only trigger once.
     * @param {string} channelName
     * @param {object} callback
     */

    onOnce(channelName, callback) {
        return this._core.event.once(channelName, callback)
    }

    /**
     * Remove a event.
     * @param {string} channelName
     * @param {string|object} id Event id or has {id} object.
     */

    off(channelName, name) {
        return this._core.event.off(channelName, name)
    }

    /**
     * Emit a event.
     * @param {string} channelName
     * @param {...*} params
     */

    emit(channelName, ...params) {
        return this._core.event.emit(this, channelName, params)
    }

    /**
     * Get locales message.
     * @param {string} name key name
     * @param {object} [value] parameter
     * @returns {string}
     */

    meg(name, value) {
        return this._core.message.get(name, value)
    }

    /**
     * Create a sprite.
     * @param {string} containerName
     * @param {string} spriteName
     * @returns {sprite}
     * @see {@link Sprite}
     */

    make(containerName, spriteName) {
        return this._core.make(containerName, spriteName)
    }

    /**
     * Batch create sprite, and call $born().
     * @param {string} containerName
     * @param {string} spriteName
     * @param {array} items
     * @returns {array}
     */

    batch(containerName, spriteName, items) {
        return this._core.batch(containerName, spriteName, items)
    }

    /**
     * Create a collection.
     * @param {string} containerName
     * @param {string} spriteName
     * @returns {@link Collection}
     */

    collection(containerName, spriteName) {
        return this._core.makeCollection(containerName, spriteName)
    }

    /**
     * register container.
     * @param {string} name
     * @param {object} data
     * @param {object} [options] Container call install() can get this.
     * @returns {*} Container install return value.
     * @see {@link Container}
     */

    join(name, data, options) {
        let container = this._core.addContainer(name, data)
        let configs = container.options.configs
        return container.options.install.call(this, configs, options)
    }

    /**
     * Add package.
     * @param {object} optinos package
     * @param {string} optinos.name package name
     * @param {object} [optinos.rules] rules
     * @param {object} [optinos.locales] locales
     */

    addon(optinos) {
        this._core.addon(optinos)
    }

    /**
     * Add plugin.
     * @param {Class} Plugin
     */

    plugin(Plugin) {
        return this._core.plugin(Plugin)
    }

    /**
     * Get the assign rules.
     * @param {array.<string|fn>} data
     * @returns {array.<fn>}
     */

    getRules(data) {
        return this._core.getRules(data)
    }

    /**
     * Setting Locale.
     * @param {string} locale default is 'en-us'.
     */

    setLocale(locale) {
        this._core.setLocale(locale)
    }

    /**
     * Validate source whether designation sprite.
     * @param {string} containerName
     * @param {string} name
     * @param {sprite} source
     * @returns {boolean}
     */

    instanceof(containerName, name, source) {
        return this._core.instanceof(containerName, name, source)
    }
}

/**
 * Helper global interface.
 * @static
 * @see {@link Helper}
 */

Oobe.helper = Helper
Oobe.Configs = Configs

module.exports = Oobe

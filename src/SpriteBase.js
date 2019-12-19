const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')
const Configs = require('./Configs')
const SpriteUnit = require('./SpriteUnit')
const Distortion = require('./Distortion')
const CollectionUnit = require('./CollectionUnit')

/**
 * @namespace SpriteBase
 * @property {function} body Data structure.
 * @property {object.<string>} [refs]
 * @property {object.<fn>} [views]
 * @property {object.<array>} [rules]
 * @property {object} [dist]
 * @property {array.<string>} [dist[].fixed]
 * @property {array.<string>} [dist[].hidden]
 * @property {function} [dist[].export]
 * @property {object.<fn>} [methods]
 * @property {function} [born]
 * @property {function} [origin]
 * @property {function} [created]
 */

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.dists = {}
        this.cache = null
        this.container = container
        this.options = Helper.verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            self: [false, ['function'], () => ({})],
            born: [false, ['function'], data => data],
            views: [false, ['object'], {}],
            dists: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            origin: [false, ['function'], function() { return this.$body() }],
            methods: [false, ['object'], {}],
            created: [false, ['function'], null],
            collection: [false, ['object'], {}],
            defaultView: [false, ['function'], null],
            errorMessage: [false, ['function'], data => data]
        })
        if (options.states) {
            throw new Error('States already rename to dists.')
        }
        this.refKeys = Object.keys(this.options.refs)
        this.init()
    }

    init() {
        this.initEvent()
        this.initViews()
        this.initDistortion()
        this.initMethods()
        this.initCollectionViews()
        this.initCollectionMethods()
    }

    initEvent() {
        this.event = new Event('sprite', this.container.event, {
            name: this.name
        })
    }

    initDistortion() {
        let distortions = this.container.options.dists.concat(Configs.defaultDistortion)
        for (let name of distortions) {
            this.dists[name] = new Distortion(name, this.options.dists[name])
        }
    }

    initViews() {
        let views = this.options.views
        this.Views = function(unit) {
            this._views = views
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.Views.prototype, key, {
                get: function() {
                    return this._views[key].apply(this._target, arguments)
                }
            })
        }
    }

    initMethods() {
        let methods = {
            ...this.container.options.methods,
            ...this.options.methods
        }
        this.Methods = function(unit) {
            this._target = unit
            this._methods = methods
        }
        for (let key in methods) {
            this.Methods.prototype[key] = function() {
                return this._methods[key].apply(this._target, arguments)
            }
        }
    }

    initCollectionViews() {
        let views = this.options.collection.views || {}
        this.CollectionViews = function(unit) {
            this._views = views
            this._target = unit
        }
        for (let key in views) {
            Object.defineProperty(this.CollectionViews.prototype, key, {
                get: function() {
                    return this._views[key].apply(this._target, arguments)
                }
            })
        }
    }

    initCollectionMethods() {
        let selfMethods = this.options.collection.methods || {}
        let methods = {
            ...selfMethods,
            ...this.container.options.collectionMethods
        }
        this.CollectionMethods = function(unit) {
            this._target = unit
            this._methods = methods
        }
        for (let key in methods) {
            this.CollectionMethods.prototype[key] = function() {
                return this._methods[key].apply(this._target, arguments)
            }
        }
    }

    isUs(sprite) {
        return sprite._sprite.base === this
    }

    getViews(unit) {
        return new this.Views(unit)
    }

    getMethods(unit) {
        return new this.Methods(unit)
    }

    create(options) {
        return new SpriteUnit(this, options)
    }

    createCollection(options) {
        return new CollectionUnit(this, options)
    }
}

module.exports = SpriteBase

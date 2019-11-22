class LoaderCore {
    constructor(type, target, name, handler) {
        this.name = name
        this.done = false
        this.type = type
        this.error = null
        this.called = false
        this.target = target
        this.loading = false
        this.handler = handler
        if (this.type === 'sprite') {
            target.$on('$reset', () => {
                this.reset()
                this.called = false
            })
        }
        if (typeof handler !== 'function') {
            this.$devError('Loader', 'Handler not a function')
        }
    }

    close(error) {
        this.done = true
        this.loading = false
        if (error) {
            this.error = error
            if (this.type === 'sprite') {
                this.target.$emit('#loader.error', [{ name: this.name, error }])
            } else {
                this.target.emit('#loader.error', [{ name: this.name, error }])
            }
        } else {
            if (this.type === 'sprite') {
                this.target.$emit('#loader.success', [{ name: this.name }])
            } else {
                this.target.emit('#loader.success', [{ name: this.name }])
            }
        }
    }

    reset() {
        this.done = false
        this.error = null
        this.loading = false
    }

    start(args) {
        this.reset()
        this.called = true
        this.loading = true
        return new Promise((resolve, reject) => {
            let success = () => {
                this.close()
                resolve()
            }
            let error = (err = 'Unknown error.') => {
                this.close(err)
                reject(err)
            }
            this.handler.call(this.target, this.target, success, error, ...args)
        })
    }
}

class Loader {
    constructor(type, target, name, handler) {
        this._core = new LoaderCore(type, target, name, handler)
    }

    get called() {
        return this._core.called
    }

    get done() {
        return this._core.done
    }

    get error() {
        return this._core.error
    }

    get loading() {
        return this._core.loading
    }

    start(...args) {
        return this._core.start(args)
    }

    clear() {
        this._core.clear()
    }
}

module.exports = class {
    constructor(oobe) {
        this.oobe = oobe
        this.loaders = new Map()
        oobe.loader = {}
        oobe.loader.set = this.set.bind(this)
        oobe.on('container.sprite.unit.$init', (context, sprite) => {
            let name = sprite._sprite.base.name
            let containerName = sprite._sprite.base.container.name
            sprite.$loader = this.get('sprite', sprite, containerName, name)
        })
        oobe.on('container.sprite.collection.$init', (context, collection) => {
            let name = collection._collection.base.name
            let containerName = collection._collection.base.container.name
            collection.loader = this.get('collection', collection, containerName, name)
        })
    }

    key(...args) {
        return args.join('/')
    }

    set(containerName, spriteName, options) {
        let key = this.key(containerName, spriteName)
        if (this.loaders.has(key) === false) {
            this.loaders.set(key, options)
        }
    }

    get(type, target, containerName, name) {
        let config = this.loaders.get(this.key(containerName, name)) || {}
        let loaders = {}
        if (config[type] == null) {
            return loaders
        }
        let map = config[type]
        for (let key in map) {
            loaders[key] = new Loader(type, target, key, map[key])
        }
        return loaders
    }
}

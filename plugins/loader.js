class LoaderCore {
    constructor(sprite, name, handler) {
        this.name = name
        this.done = false
        this.error = null
        this.sprite = sprite
        this.loading = false
        this.handler = handler
        if (typeof handler !== 'function') {
            this.$devError('Loader', 'Handler not a function')
        }
    }

    close(error) {
        this.done = true
        this.loading = false
        if (error) {
            this.error = error
            this.sprite.$emit('#loader.error', [{ name: this.name, error }])
        } else {
            this.sprite.$emit('#loader.success', [{ name: this.name }])
        }
    }

    reset() {
        this.done = false
        this.error = null
        this.loading = false
    }

    start(args) {
        this.reset()
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
            this.handler.call(this.sprite, this.sprite, success, error, ...args)
        })
    }
}

class Loader {
    constructor(sprite, name, handler) {
        this._core = new LoaderCore(sprite, name, handler)
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
            sprite.$loader = this.get(sprite, containerName, name)
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

    get(sprite, containerName, name) {
        let target = this.loaders.get(this.key(containerName, name)) || {}
        let loaders = {}
        for (let key in target) {
            loaders[key] = new Loader(sprite, key, target[key])
        }
        return loaders
    }
}

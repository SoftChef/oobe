class LoaderCore {
    constructor(type, target, name, handler) {
        this.name = name
        this.type = type
        this.done = false
        this.error = null
        this.called = false
        this.target = target
        this.loading = false
        this.handler = handler
        this.starting = null
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
                this.target.$emit('$loader.error', [{ name: this.name, error }])
            } else {
                this.target.emit('$loader.error', [{ name: this.name, error }])
            }
        } else {
            if (this.type === 'sprite') {
                this.target.$emit('$loader.success', [{ name: this.name }])
            } else {
                this.target.emit('$loader.success', [{ name: this.name }])
            }
        }
    }

    reset() {
        this.done = false
        this.error = null
        this.loading = false
        this.starting = null
    }

    start(args) {
        this.reset()
        this.called = true
        this.loading = true
        this.starting = new Promise((resolve, reject) => {
            let success = () => {
                this.close()
                resolve()
            }
            let error = (err = 'Unknown error.') => {
                this.close(err)
                reject(err)
            }
            this.handler.call(this.target, success, error, ...args)
        })
        return this.starting
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

    seek(...args) {
        return new Promise((resolve, reject) => {
            if (this.done) {
                if (this.error) {
                    reject(this.error)
                } else {
                    resolve()
                }
            } else {
                if (this.called) {
                    this._core
                        .starting
                        .then(resolve)
                        .catch(reject)
                } else {
                    this.start(...args)
                        .then(resolve)
                        .catch(reject)
                }
            }
        })
    }

    start(...args) {
        return this._core.start(args)
    }

    clear() {
        this._core.clear()
    }
}

class LoaderCase {
    constructor() {
        this._properties = []
    }

    get $error() {
        for (let key of this._properties) {
            if (this[key].error) {
                return {
                    key,
                    value: this[key].error
                }
            }
        }
        return null
    }

    get $loading() {
        for (let key of this._properties) {
            if (this[key].loading) {
                return {
                    key,
                    value: this[key].loading
                }
            }
        }
        return null
    }
}

module.exports = function(target, type, options) {
    let loaders = new LoaderCase()
    if (options == null) {
        return loaders
    }
    for (let key in options) {
        loaders[key] = new Loader(type, target, key, options[key])
        loaders._properties.push(key)
    }
    return loaders
}

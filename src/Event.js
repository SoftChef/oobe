const Base = require('./Base')
const Helper = require('./Helper')

class Event extends Base {
    constructor(type, parent, profile = {}) {
        super('Event')
        this.type = type
        this.parent = parent
        this.channels = {}
        this.profile = profile
        this.profile.type = type
    }

    addChannel(name) {
        this.channels[name] = new Channel()
    }

    getChannel(name) {
        if (this.channels[name] == null) {
            this.addChannel(name)
        }
        return this.channels[name]
    }

    on(channelName, callback) {
        return this.getChannel(channelName).addListener(callback)
    }

    once(channelName, callback) {
        return this.on(channelName, function(...args) {
            callback.apply(this, args)
            args[0].listener.off()
        })
    }

    off(channelName, target) {
        let event = typeof target === 'string' ? target : target.id
        this.getChannel(channelName).removeListener(event)
    }

    emit(target, channelName, params = []) {
        if (Array.isArray(params) === false) {
            this.$systemError('emit', 'Params not a array.')
        }
        this.trigger(channelName, target, params)
    }

    trigger(channelName, target, params, oldContext) {
        let channel = this.getChannel(channelName)
        let hasListener = channel.hasListener()
        if (hasListener === false && this.parent == null) {
            return undefined
        }
        let context = Object.assign({ channelName, target, oldContext }, this.profile)
        if (hasListener) {
            channel.broadcast(target, context, params)
        }
        if (this.parent) {
            this.parent.trigger(this.type + '.' + channelName, target, params, context)
        }
    }
}

class Channel extends Base {
    constructor() {
        super('Channel')
        this.listeners = {}
        this.listenerSize = 0
    }

    hasListener() {
        return this.listenerSize !== 0
    }

    checkListener(id) {
        if (this.listeners[id] == null) {
            this.$devError('checkListener', `Listener id(${id}) not found.`)
        }
    }

    addListener(callback) {
        if (typeof callback !== 'function') {
            this.$devError('addListener', 'Callback must be a function', callback)
        }
        let id = Helper.generateId()
        this.listeners[id] = new Listener(this, id, callback)
        this.listenerSize += 1
        return this.listeners[id].export
    }

    removeListener(id) {
        this.checkListener(id)
        this.listenerSize -= 1
        delete this.listeners[id]
    }

    broadcast(target, context, params) {
        for (let listener of Object.values(this.listeners)) {
            listener.trigger(target, context, params)
        }
    }
}

class Listener extends Base {
    constructor(channel, id, callback) {
        super('Listener')
        this.id = id
        this.channel = channel
        this.callback = callback
        this.export = {
            id: this.id,
            off: () => { this.channel.removeListener(this.id) }
        }
    }

    trigger(target, context, params) {
        let callbackContext = Object.assign({ listener: this.export }, context)
        if (params.length === 0) {
            this.callback.call(target, callbackContext)
        } else {
            this.callback.call(target, callbackContext, ...params)
        }
    }
}

module.exports = Event

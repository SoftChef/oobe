const Base = require('./Base')
const Helper = require('./Helper')

class Event extends Base {
    constructor(type, parent, profile = {}) {
        super('Event')
        this.type = type
        this.parent = parent
        this.channels = {}
        this.profile = { type, ...profile }
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

    trigger(channelName, target, params, context, ignoreQueue) {
        let newContext = Object.assign({ channelName, target, context }, this.profile)
        this.getChannel(channelName).broadcast(target, newContext, params)
        if (this.parent) {
            this.parent.trigger(this.type + '.' + channelName, target, params, newContext, true)
        }
    }
}

class Channel extends Base {
    constructor() {
        super('Channel')
        this.listeners = {}
        this.listenerKeys = null
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
        return this.listeners[id].export
    }

    removeListener(id) {
        this.checkListener(id)
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

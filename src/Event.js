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
        return this.channels[name]
    }

    getOrCreate(name) {
        if (this.channels[name] == null) {
            this.addChannel(name)
        }
        return this.channels[name]
    }

    on(name, callback) {
        return this.getOrCreate(name).addListener(callback)
    }

    once(channelName, callback) {
        return this.on(channelName, function(event) {
            callback.apply(this, arguments)
            event.listener.off()
        })
    }

    off(channelName, target) {
        let event = typeof target === 'string' ? target : target.id
        this.getOrCreate(channelName).removeListener(event)
    }

    emit(target, channelName, params = []) {
        if (Array.isArray(params) === false) {
            this.$systemError('emit', 'Params not a array.')
        }
        this.trigger(channelName, target, params)
    }

    trigger(channelName, target, params, context) {
        let channel = this.getChannel(channelName)
        if (channel == null && this.parent == null) {
            return undefined
        }
        let newContext = Object.assign({ channelName, target, context }, this.profile)
        if (channel) {
            channel.broadcast(target, newContext, params)
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

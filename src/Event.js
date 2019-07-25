const Base = require('./Base')

class Event extends Base {
    constructor(type, parent, profile) {
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

    on(channelName, name, callback) {
        this.getChannel(channelName).addListener(name, callback)
    }

    off(channelName, name) {
        this.getChannel(channelName).removeListener(name)
    }

    emit(target, channelName, params) {
        this.trigger(channelName, target, params)
    }

    trigger(channelName, target, data) {
        let context = { ...this.profile, data }
        this.getChannel(channelName).broadcast(target, context)
        if (this.parent) {
            this.parent.trigger(this.type + '.' + channelName, target, context)
        }
    }
}

class Channel extends Base {
    constructor() {
        super('Channel')
        this.listeners = {}
        this.listenerKeys = null
    }

    checkListener(name) {
        if (this.listeners[name] == null) {
            this.$systemError('checkListener', `Listener name(${name}) not found.`)
        }
    }

    addListener(name, callback) {
        if (typeof callback !== 'function') {
            this.$systemError('addListener', `Callback must be a function`, callback)
        }
        this.checkListener(name)
        this.listeners[name] = new Listener(this, name, callback)
    }

    removeListener() {
        this.checkListener(name)
        delete this.listeners[name]
    }

    broadcast(target, context) {
        for (let listener of Object.values(this.listeners)) {
            listener.trigger(target, context)
        }
    }
}

class Listener extends Base {
    constructor(channel, name, callback) {
        super('Listener')
        this.name = name
        this.channel = channel
        this.callback = callback
    }

    trigger(target, context) {
        this.callback.call(target, context)
    }
}

module.exports = Event

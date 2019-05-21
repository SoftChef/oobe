const Base = require('./Base')

class Event extends Base {
    constructor(target, channels = []) {
        super('Event')
        this.target = target
        this.channels = {}
        for (let name of channels) {
            this.addChannel(name)
        }
    }

    hasChannel(name) {
        return !!this.channels[name]
    }

    addChannel(name, options) {
        if (this.hasChannel(name)) {
            this.$systemError('addChannel', `Name(${name}) already exists.`)
        } else {
            this.channels[name] = {
                listener: [],
                activate: false,
                lastData: null,
                mode: this.$verify(options, {
                    keepLive: [false, ['boolean'], false]
                })
            }
        }
    }

    on(name, callback) {
        if (this.hasChannel(name)) {
            let caller = callback.bind(this.target)
            let channel = this.channels[name]
            channel.listener.push(caller)
            if (channel.mode.keepLive && channel.activate) {
                caller(channel.lastData)
            }
        } else {
            this.$systemError('on', `Channel ${name} not found.`)
        }
    }

    emit(name, data) {
        if (this.hasChannel(name)) {
            let channel = this.channels[name]
            channel.activate = true
            channel.lastData = data
            for (let listener of channel.listener) {
                listener(data)
            }
        } else {
            this.$systemError('on', `Channel ${name} not found.`)
        }
    }
}

module.exports = Event

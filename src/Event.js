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

    addChannel(name) {
        if (this.hasChannel(name)) {
            this.$systemError('addChannel', `Name(${name}) already exists.`)
        } else {
            this.channels[name] = []
        }
    }

    on(name, callback) {
        if (this.hasChannel(name)) {
            this.channels[name].push(callback.bind(this.target))
        } else {
            this.$systemError('on', `Channel ${name} not found.`)
        }
    }

    emit(name, data) {
        if (this.hasChannel(name)) {
            let channel = this.channels[name]
            for (let listener of channel) {
                listener(data)
            }
        } else {
            this.$systemError('on', `Channel ${name} not found.`)
        }
    }
}

module.exports = Event

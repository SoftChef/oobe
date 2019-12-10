const Sprite = require('./Sprite')

let propertyEvents = []
let usePropertyEvent = false

function broadcastPropertyEvent(sprite, key, value) {
    for (let event of propertyEvents) {
        event({ sprite, key, value })
    }
}

function getDefineProperty(name, key) {
    if (name === 'refs') {
        return function() {
            return this._sprite.refs[key].unit
        }
    } else {
        return function() {
            return this._sprite.body[key]
        }
    }
}

function setDefineProperty(key, protect) {
    return function(value) {
        if (this._sprite.isLive()) {
            if (protect) {
                return this._sprite.$devError('set', `This property(${key}) is protect.`)
            }
            if (typeof value === 'function') {
                return this._sprite.$devError('set', 'Body data not allow function.')
            }
            if (usePropertyEvent) {
                broadcastPropertyEvent(this, key, value)
            }
            this._sprite.body[key] = value
        }
    }
}

exports.onPropertySet = function(event) {
    usePropertyEvent = true
    propertyEvents.push(event)
}

exports.makeSpriteCache = function(sprite) {
    let refs = sprite.options.refs
    let body = sprite.options.body.call(sprite.unit)
    let Unit = class extends Sprite {}
    for (let key in body) {
        Object.defineProperty(Unit.prototype, key, {
            get: getDefineProperty('body', key),
            set: setDefineProperty(key)
        })
    }
    for (let key in refs) {
        Object.defineProperty(Unit.prototype, key, {
            get: getDefineProperty('refs', key),
            set: setDefineProperty(key, true)
        })
    }
    return Unit
}

const Base = require('./Base')

class Message extends Base {
    constructor() {
        super('Locale')
        this.store = { 'en-us': {} }
        this.default = this.store['en-us']
        this.setlocale('en-us')
    }

    setlocale(locale) {
        if (typeof locale !== 'string') {
            return this.$systemError('setlocale', `Locale(${locale}) not be strung.`)
        }
        this.locale = locale
        this.messages = this.store[locale]
    }

    add(data) {
        if (typeof data !== 'object') {
            return this.$systemError('set', 'Data not a object', data)
        }
        for (let key in data) {
            if (this.store[key] == null) {
                this.store[key] = {}
            }
            for (let name in data[key]) {
                this.store[key][name] = data[key]
            }
        }
    }

    get(key, value) {
        let message = this.messages[key] || this.default[key] || key
        if (value) {
            for (let key in value) {
                let reg = new RegExp(`{${key}}`, 'g')
                message = message.replace(reg, value[key])
            }
        }
        return message
    }
}

module.exports = Message

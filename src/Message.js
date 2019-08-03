const Base = require('./Base')

class Message extends Base {
    constructor() {
        super('Locale')
        this.store = { 'en-us': {} }
        this.default = this.store['en-us']
        this.setLocale('en-us')
    }

    setLocale(locale) {
        if (typeof locale !== 'string') {
            return this.$devError('setLocale', `Locale(${locale}) not be string.`)
        }
        this.messages = this.getStore(locale)
    }

    getStore(locale) {
        if (this.store[locale] == null) {
            this.store[locale] = {}
        }
        return this.store[locale]
    }

    add(data, prefix = '') {
        if (typeof data !== 'object') {
            return this.$devError('set', 'Data not a object', data)
        }
        for (let key in data) {
            let store = this.getStore(key)
            for (let name in data[key]) {
                store[prefix + name] = data[key][name]
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

const Base = require('./Base')
const Helper = require('./Helper')

class Rule extends Base {
    constructor() {
        super('Rule')
        this.items = {}
    }

    add(name, rule) {
        if (this.items[name]) {
            this.$systemError('add', `The name(${name}) already exists.`)
        }
        if (typeof rule === 'function') {
            rule = { handler: rule }
        }
        this.items[name] = Helper.verify(rule, {
            handler: [true, ['function']],
            allowEmpty: [false, ['boolean'], true]
        })
    }

    addMultiple(rules, prefix = '') {
        for (let name in rules) {
            this.add(prefix + name, rules[name])
        }
    }

    get(target, raw) {
        let args = raw.split('|')
        let name = args.shift()
        let rule = this.items[name]
        let params = {}
        if (rule == null) {
            this.$systemError('get', `Form rule list name(${name}) not found.`)
        }
        for (let value of args) {
            let data = value.split(':')
            params[data[0]] = data[1] === undefined ? true : data[1]
        }
        return function(value) {
            if (rule.allowEmpty && Helper.isEmpty(value)) {
                return true
            }
            return rule.handler.call(target, value, params)
        }
    }

    getMore(target, array) {
        let output = []
        for (let data of array) {
            let rule = typeof data === 'function' ? data.bind(target) : this.get(target, data)
            output.push(rule)
        }
        return output
    }

    validate(target, value, array) {
        let rules = this.getMore(target, array)
        for (let rule of rules) {
            let result = rule(value)
            if (result !== true) {
                return result
            }
        }
        return true
    }
}

module.exports = Rule

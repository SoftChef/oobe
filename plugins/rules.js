module.exports = {
    name: 's',
    rules: {
        string: (value, params, message) => {
            return typeof value === 'string' ? true : message('s/isString', value)
        }
    },
    locale: {
        'en-us': {
            'isString': 'Value {value} not a string'
        }
    }
}

sprite.rules(['s/string'])

module.exports = {
    name: 's',
    rules: {
        require: function(value, params) {
            let type = typeof value
            if (this.$meg == null) {
                console.log(this)
            }
            let message = this.$meg('[s]require', { value })
            if (value == null) {
                return message
            } else if (type === 'string' && value === '') {
                return message
            } else if (Array.isArray(value) && value.length === 0) {
                return message
            } else if (type === 'object' && Object.keys(value).length === 0) {
                return message
            }
            return true
        }
    },
    locale: {
        'en-us': {
            'require': 'Value {value} must be required.'
        }
    }
}

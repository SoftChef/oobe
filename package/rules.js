module.exports = {
    name: 'sc',
    rules: {
        require(value, params) {
            let message = this.$meg('#sc.require', { value })
            return this.$helper.isEmpty(value) ? message : true
        },
        string(value) {
            return typeof value === 'string' ? true : 'error'
        },
        number(value) {
            return typeof value === 'number' ? true : 'error'
        }
    },
    locales: {
        'en-us': {
            'require': 'Value {value} must be required.'
        }
    }
}

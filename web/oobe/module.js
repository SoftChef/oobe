export default {
    name: 'sc',
    rules: {
        require(value, params) {
            let message = this.$meg('#sc.require', { value })
            return this.$helper.isEmpty(value) ? message : true
        },
        number(value) {
            let message = this.$meg('#sc.number', { value })
            return this.$helper.getType(value) !== 'number' ? message : true
        }
    },
    locale: {
        'en-us': {
            'require': 'Value must be required.',
            'number': 'Value {value} not a number.'
        }
    }
}

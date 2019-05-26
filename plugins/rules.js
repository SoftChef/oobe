module.exports = {
    name: 'sc',
    rules: {
        require: function(value, params) {
            let message = this.$meg('[sc]require', { value })
            return this.$helper.isEmpty(value) ? message : true
        }
    },
    locale: {
        'en-us': {
            'require': 'Value {value} must be required.'
        }
    }
}

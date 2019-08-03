export default {
    name: 'sc',
    rules: {
        require: {
            allowEmpty: true,
            handler(value, params) {
                let message = this.$meg('#sc.require', { value })
                return this.$helper.isEmpty(value) ? message : true
            }
        },
        number(value) {
            let message = this.$meg('#sc.number', { value })
            return this.$helper.getType(Number(value)) !== 'number' ? message : true
        }
    },
    locales: {
        'en-us': {
            'require': 'Value must be required.',
            'number': 'Value {value} not a number.'
        },
        'zh-tw': {
            'require': '必填。',
            'number': '必須為數字。'
        }
    }
}

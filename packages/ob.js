module.exports = {
    name: 'ob',
    rules: {
        required: {
            allowEmpty: false,
            handler(value) {
                return !this.$helper.isEmpty(value) ? true : this.$meg('#ob.required')
            }
        },
        alphanumeric(value) {
            return !(/\W/ig).test(value) ? true : this.$meg('#ob.alphanumeric')
        },
        email(value) {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || this.$meg('#ob.email')
        },
        range(value, params) {
            let isNumber = this.$helper.getType(Number(value)) === 'number'
            let number = isNumber ? value : (value.length || 0)
            if (params.max && number > Number(params.max)) {
                return this.$meg(isNumber ? '#ob.max' : '#ob.maxLength') + ' : ' + params.max
            }
            if (params.min && number < Number(params.min)) {
                return this.$meg(isNumber ? '#ob.min' : '#ob.minLength') + ' : ' + params.min
            }
            if (params.same && number === Number(params.same)) {
                return this.$meg('#ob.same') + ' : ' + params.same
            }
            return true
        },
        type(value, params = {}) {
            let is = params.is || 'string'
            return typeof value === is ? true : this.$meg('#ob.type') + ' : ' + is
        },
        strongType(value, params) {
            let is = params.is || 'string'
            return this.$helper.getType(value) === is ? true : this.$meg('#ob.type') + ' : ' + is
        },
        number(value) {
            return this.$helper.getType(Number(value)) === 'number' ? true : this.$meg('#ob.number')
        },
        hhmm(value) {
            let split = typeof value === 'string' ? value.split(':') : ''
            if (split.length === 2 && split[0].length === 2 && split[1].length === 2 && /\d\d/.test(split[0]) && /\d\d/.test(split[1])) {
                return Number(split[0]) >= 24 || Number(split[1]) >= 60 ? this.$meg('#ob.hh-mm') : true
            }
            return this.$meg('#ob.hh-mm')
        },
        mmdd(value) {
            let split = typeof value === 'string' ? value.split(':') : ''
            if (split.length === 2 && split[0].length === 2 && split[1].length === 2 && /\d\d/.test(split[0]) && /\d\d/.test(split[1])) {
                return Number(split[0]) >= 12 || Number(split[1]) >= 31 ? this.$meg('#ob.mm-dd') : true
            }
            return this.$meg('#ob.mm-dd')
        },
        yyyymm(value) {
            let reg = /((((19|20)\d{2})-(0?[13578]|1[02]))|(((19|20)\d{2})-(0?[469]|11))|(((19|20)\d{2})-0?2)|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2))$/
            return reg.test(value) ? true : this.$meg('#ob.yyyy-mm')
        },
        yyyymmdd(value) {
            let reg = /((((19|20)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((19|20)\d{2})-(0?[469]|11)-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-(0?[1-9]|[12]\d)))$/
            return reg.test(value) && value.length >= 10 ? true : this.$meg('#ob.yyyy-mm-dd')
        }
    },
    locales: {
        'en-us': {
            'required': 'The field is required',
            'alphanumeric': 'The field only allow alphanumeric characters, a-zA-Z0-9_',
            'email': 'The field is invalid email format',
            'number': 'The field only allow numeric',
            'hh-mm': 'The field is invalid date format, hh-mm',
            'mm-dd': 'The field is invalid date format, mm-dd',
            'yyyy-mm': 'The field is invalid date format, yyyy-mm',
            'yyyy-mm-dd': 'The field is invalid date format, yyyy-mm-dd',
            'max': 'Maximum value is ',
            'min': 'Minimum value is ',
            'maxLength': 'Maximum length is ',
            'minLength': 'Minimum length is ',
            'type': 'Data type must be',
            'same': 'The field must be equal to '
        },
        'zh-tw': {
            'required': '必填',
            'alphanumeric': '必須為數字、英文或_符號',
            'email': '必須為信箱',
            'number': '必須為數字',
            'hh-mm': '日期格式必須為hh-mm',
            'mm-dd': '日期格式必須為mm-dd',
            'yyyy-mm': '日期格式必須為yyyy-mm',
            'yyyy-mm-dd': '日期格式必須為yyyy-mm-dd',
            'max': '超過最大值',
            'min': '低於最小值',
            'maxLength': '超過最大長度',
            'minLength': '低於最小長度',
            'type': '型別必須是',
            'same': '長度必須為'
        }
    }
}

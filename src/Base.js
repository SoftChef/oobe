class Base {
    constructor(name) {
        this._base = {
            name
        }
    }

    /**
     * @function $systemError(functionName,maessage,object)
     * @private
     * @desc 於console呼叫錯誤，中斷程序並顯示錯誤的物件
     */

    $systemError(functionName, message, object = '$_no_error') {
        if (object !== '$_no_error') {
            console.log('error data => ', object)
        }
        throw new Error(`(☉д⊙)!! Oobe::${this._base.name} => ${functionName} -> ${message}`)
    }

    /**
     * @function $verify
     * @private
     * @desc 驗證格式是否正確
     */

    $verify(data, validates, assign = {}) {
        let newData = {}
        for (let key in validates) {
            let validate = validates[key]
            let required = validate[0]
            let type = validate[1]
            let defaultValue = validate[2]
            if (required && data[key] == null) {
                this.$systemError('verify', `Key(${key}) is required`)
            }
            if (type && data[key] != null && !type.includes(typeof data[key])) {
                this.$systemError('verify', `Type(${key}::${typeof data[key]}) error, need ${type.join(' or ')}`)
            }
            newData[key] = data[key] || defaultValue
        }
        return Object.assign(newData, assign)
    }
}

module.exports = Base

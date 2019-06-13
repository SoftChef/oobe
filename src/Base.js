class Base {
    constructor(name) {
        this._base = { name }
    }

    $systemError(functionName, message, object = '$_no_error') {
        if (object !== '$_no_error') {
            console.log('error data => ', object)
        }
        throw new Error(`(☉д⊙)!! Oobe::${this._base.name} => ${functionName} -> ${message}`)
    }

    $verify(data, validates) {
        let newData = {}
        for (let key in validates) {
            let target = data[key]
            let validate = validates[key]
            let required = validate[0]
            let types = validate[1]
            let defaultValue = validate[2]
            let type = Array.isArray(target) ? 'array' : typeof target
            if (required && target == null) {
                this.$systemError('verify', `Key(${key}) is required`)
            }
            if (types && target != null && !types.includes(type)) {
                this.$systemError('verify', `Type(${key}::${type}) error, need ${types.join(' or ')}`)
            }
            newData[key] = target || defaultValue
        }
        return newData
    }
}

module.exports = Base

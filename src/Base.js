let onDevErrors = []

class Base {
    constructor(name) {
        this._base = { name }
    }

    static onDevError(callback) {
        onDevErrors.push(callback)
    }

    $devError(functionName, message) {
        for (let callback of onDevErrors) {
            callback.call(this, {
                name: this._base.name,
                target: this,
                message,
                functionName
            })
        }
        throw new Error(`(☉д⊙)!! Oobe::${this._base.name} => ${functionName} -> ${message}`)
    }

    $systemError(functionName, message, object = '$_no_error') {
        if (object !== '$_no_error') {
            console.log('error data => ', object)
        }
        console.error('Please take this error message to : https://github.com/SoftChef/oobe/issues/new')
        throw new Error(`(☉д⊙)!! System Error, Oobe::${this._base.name} => ${functionName} -> ${message}`)
    }
}

module.exports = Base

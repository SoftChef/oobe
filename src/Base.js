class Base {
    constructor(name) {
        this._base = { name }
    }

    $devError(functionName, message) {
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

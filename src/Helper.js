class Helper {
    /**
     * @function jpjs(obj)
     * @static
     * @desc 深拷貝一個物件，並回傳此物件
     */

    static jpjs(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    /**
     * @function getType
     * @static
     * @desc 獲取型別
     */

    static getType(value) {
        let type = typeof value
        if (Array.isArray(value)) {
            return 'array'
        }
        if (value == null) {
            return 'empty'
        }
        if (type === 'number' && isNaN(value)) {
            return 'NaN'
        }
        if (value instanceof RegExp) {
            return 'regexp'
        }
        return type
    }

    /**
     * @function isEmpty
     * @static
     * @desc 是否為空值
     */

    static isEmpty(value) {
        let type = Helper.getType(value)
        if (type === 'empty') {
            return true
        }
        if (type === 'array' && value.length === 0) {
            return true
        }
        if (type === 'object' && Object.keys(value).length === 0) {
            return true
        }
        if (type === 'string' && value === '') {
            return true
        }
        return false
    }
}

module.exports = Helper

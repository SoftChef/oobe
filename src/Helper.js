class Helper {
    /**
     * @function deepClone(obj)
     * @static
     * @desc 深拷貝一個物件，並回傳此物件
     */

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    /**
     * @function mapping
     * @static
     * @desc key 的轉移
     */

    static mapping(data, forward, map) {
        let output = {}
        if (forward) {
            for (let key in map) {
                output[map[key]] = data[key]
            }
        } else {
            for (let key in map) {
                output[key] = data[map[key]]
            }
        }
        return output
    }

    /**
     * @function getType
     * @static
     * @desc 獲取型別
     */

    static getType(value) {
        if (Array.isArray(value)) {
            return 'array'
        }
        if (value == null) {
            return 'empty'
        }
        return typeof value
    }

    /**
     * @function isEmpty
     * @static
     * @desc 是否為空值
     */

    static isEmpty(value) {
        let type = Helper.getType(value)
        if (value == null) {
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

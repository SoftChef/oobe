class Helper {
    /**
     * @function deepClone(obj)
     * @static
     * @desc 深拷貝一個物件，並回傳此物件
     */

    static deepClone(obj, hash = new WeakMap()) {
        if (Object(obj) !== obj) {
            return obj
        }
        if (obj instanceof Set) {
            return new Set(obj)
        }
        if (hash.has(obj)) {
            return hash.get(obj)
        }
        const result = obj instanceof Date ? new Date(obj) : obj instanceof RegExp ? new RegExp(obj.source, obj.flags) : Object.create(null)
        hash.set(obj, result)
        if (obj instanceof Map) {
            Array.from(obj, ([key, val]) => {
                result.set(key, Helper.deepClone(val, hash))
            })
        }
        return Object.assign(result, ...Object.keys(obj).map((key) => {
            return ({
                [key]: Helper.deepClone(obj[key], hash)
            })
        }))
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
}

module.exports = Helper

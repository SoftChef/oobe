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
     * @function inspect()
     * @static
     * @desc 移除迴圈結構的物件
     */

    static inspect(target, used = []) {
        if (target == null) {
            return null
        }
        let output = Array.isArray(target) ? [] : {}
        for (let key in target) {
            let aims = target[key]
            let type = typeof aims
            if (type === 'function') {
                continue
            } else if (type === 'object') {
                let newUsed = [target].concat(used)
                if (newUsed.includes(aims)) {
                    output[key] = 'Circular structure object.'
                } else {
                    output[key] = Helper.inspect(aims, newUsed)
                }
            } else {
                output[key] = aims
            }
        }
        return output
    }
}

module.exports = Helper

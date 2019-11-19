/**
 * Main export class
 * @hideconstructor
 */

class Helper {
    /**
     * JSON.parse(JSON.stringify)
     * @static
     * @param {*} target
     */

    static jpjs(target) {
        return JSON.parse(JSON.stringify(target))
    }

    /**
     * Get target data
     * @static
     * @param {*} target
     * @returns {string} The type other than example returns the value of typeof.
     * @example
     * getType([]) // array
     * getType(null) // empty
     * getType(undefined) // empty
     * getType(NaN) // NaN
     * getType(/test/) // regexp
     * getType(new Promise(() => {})) // promise
     * getType(Buffer.from('123')) // buffer
     */

    static getType(target) {
        let type = typeof target
        if (Array.isArray(target)) {
            return 'array'
        }
        if (target == null) {
            return 'empty'
        }
        if (type === 'number' && isNaN(target)) {
            return 'NaN'
        }
        if (target instanceof RegExp) {
            return 'regexp'
        }
        if (target instanceof Promise) {
            return 'promise'
        }
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(target)) {
            return 'buffer'
        }
        return type
    }

    /**
     * Whether it is null.
     * @static
     * @param {*} target
     * @returns {boolean}
     * @example
     * isEmpty(0) //false
     * isEmpty('') // true
     * isEmpty([]) // true
     * isEmpty({}) // true
     * isEmpty(null) // true
     * isEmpty(undefined) // true
     */

    static isEmpty(target) {
        let type = Helper.getType(target)
        if (type === 'empty') {
            return true
        }
        if (type === 'array' && target.length === 0) {
            return true
        }
        if (type === 'object' && Object.keys(target).length === 0) {
            return true
        }
        if (type === 'string' && target === '') {
            return true
        }
        return false
    }

    /**
     * Whether it is sprite.
     * @static
     * @param {*} target
     * @returns {boolean}
     */

    static isSprite(target) {
        return target instanceof Sprite
    }

    /**
     * Whether it is collection.
     * @static
     * @param {*} target
     * @returns {boolean}
     */

    static isCollection(target) {
        return target instanceof Collection
    }

    /**
     * Validate data and get default value.
     * @static
     * @param {object} data
     * @param {object.<array>} validates validate model : [required:boolean, types:array, default:*]
     * @returns {object}
     * @example
     * let options = verify({ a: 5 }, {
     *     a: [true, ['number']],
     *     b: [false, ['number'], 'test']
     * })
     * console.log(options.a) // 5
     * console.log(options.b) // test
     */

    static verify(data, validates) {
        let newData = {}
        for (let key in validates) {
            let target = data[key]
            let validate = validates[key]
            let [required, types, defaultValue] = validate
            let type = Helper.getType(target)
            if (Helper.getType(required) !== 'boolean') {
                throw new Error('Helper::verify => Required must be a boolean')
            }
            if (Helper.getType(types) !== 'array') {
                throw new Error('Helper::verify => Types must be a array')
            }
            if (required && target == null) {
                throw new Error(`Helper::verify => Key(${key}) is required`)
            }
            if (types && target != null && !types.includes(type)) {
                throw new Error(`Helper::verify => Type(${key}::${type}) error, need ${types.join(' or ')}`)
            }
            newData[key] = target === undefined ? defaultValue : target
        }
        return newData
    }

    /**
     * Object concat.
     * @static
     * @param {object} target
     * @param {object} sources
     * @returns {object}
     * @example
     * let target = {
     *     a: 5,
     *     b: 10,
     *     c: {
     *         a: 7,
     *         b: 8
     *     }
     * }
     * let output = deepObjectAssign(target, {
     *     a: 8,
     *     c: {
     *         a: 10
     *     }
     * })
     * console.log(output.a) // 8
     * console.log(output.b) // 10
     * console.log(output.c.a) // 10
     * console.log(output.c.b) // 8
     */

    static deepObjectAssign(target, sources = {}) {
        let output = {}
        for (let key in target) {
            let data = target[key]
            let sour = sources[key]
            let type = Helper.getType(data)
            if (type === 'object') {
                output[key] = Helper.deepObjectAssign(data, sour)
            } else {
                output[key] = sour === undefined ? data : sour
            }
        }
        return output
    }

    /**
     * Simulation uuid create mode, but not true uuid.
     * @static
     * @returns {string}
     */

    static generateId() {
        var now = Date.now()
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            now += performance.now()
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (now + Math.random() * 16) % 16 | 0
            now = Math.floor(now / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }

    /**
     * Check has target key, in case has key, return value, else return default.
     * @param {object} target
     * @param {string} path key path
     * @param {*} [def]
     * @returns {*}
     * @example
     * let target = {
     *     a: {
     *         b: 5
     *     }
     * }
     * let output = peel(target, 'a.b') // 5
     */

    static peel(target, path, def) {
        let output = path.split(/[.[\]'"]/g).filter(s => s !== '').reduce((obj, key) => {
            return obj && obj[key] !== 'undefined' ? obj[key] : undefined
        }, target)
        if (def) {
            return Helper.isEmpty(output) ? def : output
        }
        return output
    }

    /**
     * Convert the key of an object to a mapped key.
     * @param {object} keyMap
     * @param {object} target
     * @param {object} [options]
     * @param {string} [options.mode='body'] If valus is sprite(or collection), can set body or origin two mode for return data.
     * @param {boolean} [options.reverse=false] Reverse key.
     * @returns {object}
     * @example
     */

    static mapping(keyMap, target, options = {}) {
        let mode = options.mode ? options.mode : 'body'
        let reverse = !!options.reverse
        let output = {}
        for (let [key, value] of Object.entries(keyMap)) {
            let name = reverse ? value : key
            let data = reverse ? target[key] : target[value]
            if (Helper.isCollection(data)) {
                output[name] = mode === 'body' ? data.getBodys() : data.getOrigins()
            } else if (Helper.isSprite(data)) {
                output[name] = mode === 'body' ? data.$body() : data.$toOrigin()
            } else {
                output[name] = data
            }
        }
        return output
    }
}

module.exports = Helper

const Sprite = require('./Sprite')
const Collection = require('./Collection')

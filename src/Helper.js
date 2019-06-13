/**
 * Main export class
 * @hideconstructor
 */

class Helper {
    /**
     * JSON.parse(JSON.stringify)的深拷貝方法
     * @static
     * @param {*} data 任何可以JSON.stringify的物件
     */

    static jpjs(data) {
        return JSON.parse(JSON.stringify(data))
    }

    /**
     * 獲取型別
     * @static
     * @param {*} target 任何型態都行
     * @returns {string} example之外的型態則回傳typeof的值
     * @example
     * getType([]) // array
     * getType(null) // empty
     * getType(undefined) // empty
     * getType(NaN) // NaN
     * getType(/test/) // regexp
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
        return type
    }

    /**
     * 是否為空值
     * @static
     * @param {*} target 標的物
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
     * 是否為精靈
     * @static
     * @param {*} target 標的物
     * @returns {boolean}
     */

    static isSprite(target) {
        return target instanceof Sprite
    }
}

module.exports = Helper

const Sprite = require('./Sprite')

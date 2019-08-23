const Base = require('./Base')
const Event = require('./Event')
const Helper = require('./Helper')

class FragmentCore extends Base {
    constructor(unit, options = {}) {
        super('Fragment')
        this.unit = unit
        this.event = new Event('Fragment')
        this.queue = 0
        this.threads = []
        this.binds = {
            done: this.done.bind(this)
        }
        this.options = Helper.verify(options, {
            parallel: [false, ['number'], 1]
        })
    }

    add(thread) {
        if (typeof thread !== 'function') {
            this.$devError('add', 'Thread not a function.')
        }
        this.threads.push(thread)
        this.run()
    }

    each(items, callback) {
        for (let i = 0; i < items.length; i++) {
            this.add(done => callback(items[i], i, done))
        }
    }

    clear() {
        this.queue = 0
        this.threads = []
    }

    /**
     * 呼叫done時觸發
     * @event Fragment#$done
     * @property {object} context
     */

    run() {
        if (this.queue >= this.options.parallel) {
            return null
        }
        let thread = this.threads.shift()
        if (thread) {
            this.queue += 1
            thread(this.binds.done)
        }
    }

    done() {
        this.queue -= 1
        this.event.emit(this.unit, '$done')
        this.run()
    }
}

/**
 * 批次處裡的模型
 * @hideconstructor
 * @property {number} [parallel=1] 允許同步發送量
 */

class Fragment {
    constructor(options) {
        this._core = new FragmentCore(this, options)
    }

    /**
     * 監聽一個事件
     * @param {string} channelName 事件名稱
     * @param {object} callback 觸發事件
     */

    on(channelName, callback) {
        return this._core.event.on(channelName, callback)
    }

    /**
     * 監聽一個事件，但只觸發一次
     * @param {string} channelName 事件名稱
     * @param {object} callback 觸發事件
     */

    onOnce(channelName, callback) {
        return this._core.event.once(channelName, callback)
    }

    /**
     * 移除一個事件
     * @param {string} channelName 事件名稱
     * @param {string} id 事件id
     */

    off(channelName, id) {
        return this._core.event.off(channelName, id)
    }

    /**
     * 發送一個事件
     * @param {string} channelName 事件名稱
     * @param {object} params 傳遞參數
     */

    $emit(channelName, ...params) {
        return this._core.event.emit(this, channelName, params)
    }

    /**
     * 加入一則執行
     * @param {function} thread
     */

    add(thread) {
        this._core.add(thread)
        return this
    }

    /**
     * 批次加入一則執行
     * @param {array} items
     * @param {function} thread
     */

    each(items, thread) {
        this._core.each(items, thread)
        return this
    }

    /**
     * 清空執行續
     */

    clear() {
        this._core.clear()
    }
}

module.exports = Fragment

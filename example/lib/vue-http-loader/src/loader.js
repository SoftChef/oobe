import httpVueLoader from './http-vue-loader.js'

class Loader {
    constructor() {
        this.init()
    }

    /**
     * @function init()
     * @desc 初始化或清除記憶體垃圾時使用
     */

    init() {
        this.component = {}
    }

    /**
     * @function throwError()
     * @desc 擲出錯誤
     */

    throwError(text) {
        throw new Error(text)
    }

    /**
     * @function onload(callback)
     * @desc 呼叫等待dom元素，開始執行載入，直到載入完成清除記憶體垃圾並關閉等待dom元素
     * @callback (component)
     */

    async onload(callback) {
        var component = {}
        for (let key in this.component) {
            if (this.component[key].type === 'text') {
                component[key] = await (await httpVueLoader.readText(this.component[key].data))()
            } else {
                component[key] = await (await httpVueLoader(this.component[key].data))()
            }
        }
        callback(component)
        this.init()
    }

    //= ===============================
    //
    //  Component
    //

    addComponentFile(name, url) {
        if (this.component[name] == null) {
            this.component[name] = {
                type: 'file',
                data: url
            }
        } else {
            this.throwError('MiniVuepack::Loader => addComponentFile -> Component name is conflict.')
        }
    }

    addComponentFileFor(url, object) {
        for (let key in object) {
            this.addComponentFile(key, url + object[key])
        }
    }

    addComponentText(name, text) {
        if (this.component[name] == null) {
            this.component[name] = {
                type: 'text',
                data: text
            }
        } else {
            this.throwError('MiniVuepack::Loader => addComponentText -> Component name is conflict.')
        }
    }
}

export default Loader

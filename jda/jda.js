(function(root, factory) {
    let moduleName = 'JsdocArtist'
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = factory()
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return factory })
    } else {
        root[moduleName] = factory()
    }
})(this || (typeof window !== 'undefined' ? window : global), function() {
    /**
     * @class ModuleBase()
     * @desc 系統殼層
     */

    class ModuleBase {
        constructor(name) {
            this.baseName = name
        }

        /**
         * @function systemError(functionName,maessage,object)
         * @desc 於console呼叫錯誤，中斷程序並顯示錯誤的物件
         */

        systemError(functionName, message, object) {
            if (object) {
                console.log(`%c error object is : `, 'color:#FFF; background:red')
                console.log(object)
            }
            throw new Error(`(☉д⊙)!! JsdocArtist::${this.baseName} => ${functionName} -> ${message}`)
        }
    }

    /**
 * @class Tag()
 * @desc 解讀標籤
 */

    class Tag extends ModuleBase {
        constructor(name, head) {
            super('Tag')
            this.name = name
            this.validate('help', head.help, '', false)
            this.validate('temp', head.temp, [], false)
            this.validate('output', head.output, () => { }, true)
        }

        /**
     * @function validate(name,data,request,required)
     * @desc 驗證參數，驗證通過後變成自己的物件
     */

        validate(name, data, request, required) {
            if (required && data == null) {
                this.systemError('validate', `Tag ${name} must required`)
            }
            if (data != null && typeof data !== typeof request) {
                this.systemError('validate', `Tag ${name} type must a ${typeof request}`, data)
            }
            this[name] = data == null ? request : data
        }

        getNewData(name, text, line, params) {
            return {
                error: null,
                output: {},
                params: JSON.parse(JSON.stringify(params)),
                text: text,
                line: line,
                name: name,
                data: {}
            }
        }

        read(name, text, params, line) {
            let data = this.getNewData(name, text, line, params)
            for (let i = 0; i < this.temp.length; i++) {
                if (data.params[i]) {
                    data.data[this.temp[i]] = i === this.temp.length - 1 ? params.join(' ') : params.shift()
                } else {
                    data.error = `Params ${this.temp[i]} not found`
                }
            }
            data.output = this.output(data.data, this.error.bind(data))
            return data
        }

        error(message) {
            this.error = message
        }
    }
    /**
 * @class JsdocArtist()
 * @desc 主架構
 */

    class JsdocArtist extends ModuleBase {
        constructor() {
            super('JsdocArtist')
            this.tags = {}
            this.block = null
            this.injsdoc = false
        }

        /**
     * @function compile(data)
     * @desc 編譯文本並回傳需求
     */

        compile(data) {
            return data
        }

        /**
     * @function setCompile(callback)
     * @desc 設定編譯文本
     */

        setCompile(callback) {
            if (typeof callback === 'function') {
                this.compile = callback
            } else {
                this.systemError('setCompile', 'Callback not a function.', callback)
            }
        }

        /**
     * @function register(data)
     * @desc 註冊一個tag
     */

        register(name, data) {
            if (this.tags[name] == null) {
                this.tags[name] = new Tag(name, data)
            } else {
                this.systemError('useTags', 'Tag name is conflict or no name.', name)
            }
        }

        /**
     * @function settingBlock(text)
     * @desc 設置遭遇區塊所顯示的文字
     */

        settingBlock(text) {
            if (typeof text === 'string') {
                this.block = text
            } else {
                this.systemError('settingBlock', 'Value only string', text)
            }
        }

        /**
     * @function getInJSDoc(output,text)
     * @desc 判斷是否存在於JSDOC的範圍內
     */

        getInJSDoc(output, text) {
            let t = text.trim()
            if (t === '/**' && !this.injsdoc) {
                this.injsdoc = true
                return false
            }
            if (t === '*/' && this.injsdoc) {
                if (this.block) {
                    output.data.push(this.block)
                }
                this.injsdoc = false
            }
            return this.injsdoc
        }

        /**
     * @function readTag(out,text,line)
     * @desc 讀取一串文字並解析成tag
     */

        readTag(output, text, line) {
            let params = text.slice(text.indexOf('@') + 1).split(' ').filter((t) => {
                return t.trim() !== ''
            })
            let name = params.shift().trim()
            if (this.tags[name] != null) {
                let tag = this.tags[name].read(name, text, params, line)
                if (tag.error) {
                    output.error.push(tag)
                } else {
                    output.data.push(tag)
                }
            } else {
                output.miss.push({
                    name: name,
                    line: line,
                    text: text
                })
            }
        }

        /**
     * @function read(text,callback)
     * @desc 讀取一個文本
     */

        read(text) {
            if (typeof text === 'string') {
                let line = text.split('\n')
                let len = line.length
                let output = this.getOutputBase()
                this.injsdoc = false
                for (let i = 0; i < len; i++) {
                    if (this.getInJSDoc(output, line[i]) && line[i].match('@')) {
                        this.readTag(output, line[i], i)
                    }
                }
                for (let i = 0; i < output.data.length; i++) {
                    output.text += (typeof output.data[i] === 'string' ? output.data[i] : output.data[i].output) + '\n\n'
                }
                return this.compile(output)
            } else {
                this.systemError('read', 'Text must a string', text)
            }
        }

        /**
     * @function getOutputBase()
     * @desc 獲取輸出物件的型態
     */

        getOutputBase() {
            return {
                text: '',
                data: [],
                miss: [],
                error: []
            }
        }
    }

    let __re = JsdocArtist

    return __re
})

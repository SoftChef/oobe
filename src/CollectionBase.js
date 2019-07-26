const Base = require('./Base')
const Event = require('./Event')

class CollectionBase extends Base {
    constructor(container, name, options = {}) {
        super('Collection')
        this.name = name
        this.container = container
        this.options = Helper.verify(options, {
            claim: [true, ['function']], // 唯一值得條件
            assembly: [true, ['object']] // 組裝方法
        })
        this.init()
    }

    init() {
        this.initEvent()
    }

    initEvent() {
        this.event = new Event('collection', this.container.event, {}, {
            name: this.name
        })
    }
}

module.exports = CollectionBase

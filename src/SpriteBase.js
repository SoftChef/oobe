const Base = require('./Base')
const Shape = require('./Shape')
const Sprite = require('./Sprite')

class SpriteBase extends Base {
    constructor(container, name, options = {}) {
        super('Sprite')
        this.name = name
        this.container = container
        this.options = this.$verify(options, {
            body: [true, ['function']],
            refs: [false, ['object'], {}],
            rules: [false, ['object'], {}],
            reborn: [true, ['function']],
            origin: [true, ['function']],
            methods: [false, ['object'], {}],
            distortion: [true, ['object']]
        })
        this.initShapes()
    }

    initShapes() {
        this.shapes = {}
        let distortions = this.container.options.distortions.concat(['read', 'create', 'update', 'delete'])
        for (let name of distortions) {
            this.shapes[name] = new Shape(name, this.options.distortion[name])
        }
    }

    createSprite(data) {
        return new Sprite(this, data)
    }
}

module.exports = SpriteBase

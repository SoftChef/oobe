const Helper = require('./Helper')

class Unit {
    constructor(sprite) {
        this._sprite = sprite
        this.$on = sprite.event.on.bind(sprite.event)
        this.$out = sprite.out.bind(sprite)
        this.$dead = sprite.dead.bind(sprite)
        this.$copy = sprite.copy.bind(sprite)
        this.$body = sprite.getBody.bind(sprite)
        this.$keys = sprite.getKeys.bind(sprite)
        this.$raws = sprite.getRaws.bind(sprite)
        this.$reset = sprite.reset.bind(sprite)
        this.$rules = sprite.getRules.bind(sprite)
        this.$helper = Helper
        this.$revive = sprite.revive.bind(sprite)
        this.$export = sprite.export.bind(sprite)
        this.$status = sprite.getStatus.bind(sprite)
        this.$isFixed = sprite.isFixed.bind(sprite)
        this.$isHidden = sprite.isHidden.bind(sprite)
        this.$toOrigin = sprite.toOrigin.bind(sprite)
        this.$isChange = sprite.isChange.bind(sprite)
        this.$validate = sprite.validateAll.bind(sprite)
        this.$distortion = sprite.distortion.bind(sprite)
        initFromStatus(this, sprite)
        initFromContainer(this, sprite)
    }
}

function initFromContainer(unit, { base: { container } }) {
    unit.$meg = container.getMessage.bind(container)
    unit.$utils = container.options.utils
    unit.$configs = container.getConfigs()
}

function initFromStatus(unit, sprite) {
    Object.defineProperty(unit, '$ready', { get: () => sprite.status.ready })
    Object.defineProperty(unit, '$error', { get: () => sprite.status.error })
    Object.defineProperty(unit, '$state', { get: () => sprite.state.name })
}

module.exports = Unit

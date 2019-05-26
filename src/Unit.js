const Helper = require('./Helper')

class Unit {
    constructor(sprite) {
        this._sprite = sprite
        this._container = this._sprite.base.container
        this.$helper = Helper
        this.$configs = this._container.getConfigs()
        Object.defineProperty(this, '$state', { get: () => this._sprite.state.name })
    }

    static isSprite(target) {
        return target instanceof Unit
    }

    // ===================
    //
    // container
    //

    $meg(name, value) {
        return this._container.getMessage(name, value)
    }

    $utils() {
        return this._container.options.utils
    }

    // ===================
    //
    // sprite
    //

    $out() {
        return this._sprite.out()
    }

    $dead() {
        return this._sprite.dead()
    }

    $copy() {
        return this._sprite.copy()
    }

    $body() {
        return this._sprite.getBody()
    }

    $keys() {
        return this._sprite.getKeys()
    }

    $reset() {
        this._sprite.reset()
    }

    $rules(name, extra = []) {
        this._sprite.getRules(name, extra)
    }

    $revive() {
        return this._sprite.revive()
    }

    $export(name) {
        return this._sprite.export(name)
    }

    $isFixed(name) {
        return this._sprite.state.isFixed(name)
    }

    $isHidden(name) {
        return this._sprite.state.isHidden(name)
    }

    $toOrigin() {
        return this._sprite.toOrigin()
    }

    $isChange() {
        return this._sprite.isChange()
    }

    $validate() {
        return this._sprite.validateAll()
    }

    $distortion(name) {
        return this._sprite.distortion(name)
    }
}

module.exports = Unit

const Core = require('./Core')
const Unit = require('./Unit')

Core.isSprite = function(target) {
    return target instanceof Unit
}

module.exports = Core

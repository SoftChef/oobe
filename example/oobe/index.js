import shop from './shop/index.js'
import module from './module.js'

let core = new Oobe()

core.join('shop', shop)
core.addon(module)

export default core

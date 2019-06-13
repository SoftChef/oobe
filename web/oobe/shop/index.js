import locale from './locale.js'
import commodity from './sprites/commodity.js'

export default {
    sprites: {
        commodity
    },

    utils: {
        moment
    },

    locale,

    configs: {
        commodityCategories: [
            {
                text: 'dailyCommodities',
                value: 'dailyCommodities'
            },
            {
                text: 'drink',
                value: 'drink'
            }
        ]
    }
}

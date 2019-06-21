import locales from './locales.js'
import commodity from './sprites/commodity.js'

export default {
    sprites: {
        commodity
    },

    utils: {
        moment
    },

    locales,

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

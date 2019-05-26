import user from './user'

export default {
    sprites: {
        user
    },

    locale: {
        'en-us': {
            name: 'name',
            email: 'email',
            auto_create: 'Automatic system generation',
            country_code: 'country code',
            phone_number: 'phone number'
        },
        'zh-tw': {
            name: '名稱',
            email: '信箱',
            auto_create: '系統自動產生',
            country_code: '國碼',
            phone_number: '電話'
        }
    },

    install(configs, options) {},

    utils: {},

    configs: {},

    methods: {},

    states: [],

    rules: {}
}

import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './locales/en-us'
import tw from './locales/zh-tw'
import cn from './locales/zh-cn'

Vue.use(VueI18n)

const locale = localStorage.getItem('locale') || 'zh-tw'
const messages = {
    'en-us': en,
    'zh-tw': tw,
    'zh-cn': cn
}

const i18n = new VueI18n({
    locale,
    messages,
    fallbackLocale: 'zh-tw'
})

export default i18n

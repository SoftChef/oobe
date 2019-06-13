<template>
    <nav class="nav nav-pills pt-3 justify-content-center">
        <a class="nav-link" @click.stop="switchLang()" href="javascript:void(0)">Language:{{ locale === 'zh-tw' ? '中文' : 'English' }}</a>
    </nav>
</template>

<script>
    module.exports = {
        data() {
            return {
                locale: 'zh-tw'
            }
        },
        mounted () {
            this.switchLang()
        },
        methods: {
            switchLang() {
                this.locale = this.locale === 'zh-tw' ? 'en-us' : 'zh-tw'
                this.$i18n.locale = this.locale
                this.$oobe.setLocale(this.locale)
            }
        }
    }
</script>

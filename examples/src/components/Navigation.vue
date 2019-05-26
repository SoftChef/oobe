<template>
    <v-navigation-drawer app persistent disable-resize-watcher dark v-model="open">
        <v-list dense>
            <v-list-tile @click="changeLanguage('zh-tw')">
                <v-list-tile-title>繁體中文</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="changeLanguage('zh-cn')">
                <v-list-tile-title>简体中文</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="changeLanguage('en-us')">
                <v-list-tile-title>English</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data() {
            return {
                open: null
            }
        },
        methods: {
            changeLanguage(locale) {
                window.localStorage.setItem('locale', locale)
                this.$router.go(this.$router.currentRoute)
            }
        }
    }
</script>

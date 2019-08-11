<template>
    <div v-if="sprite" class="row justify-content-md-center">
        <div v-if="error" v-html="error"></div>
        <div v-else-if="!sprite.$ready">Loading...</div>
        <div v-else>
            <legend>{{ $t('view_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
        </div>
    </div>
</template>

<script>
    module.exports = {
        mounted () {
            this.fetch(this.$route.query.id)
        },
        methods: Vuex.mapActions(['fetch']),
        computed: Vuex.mapGetters(['sprite', 'error'])
    }
</script>

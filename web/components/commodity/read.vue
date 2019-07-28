<template>
    <div class="row justify-content-md-center">
        <div v-if="!sprite.$ready">Loading...</div>
        <div v-else>
            <legend>{{ $t('view_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                sprite: this.$oobe.make('shop', 'commodity').$dist('read')
            }
        },
        mounted () {
            this.fetch(this.$route.query.id)
                .then((data) => {
                    this.sprite.$born(data)
                })
        },
        methods: Vuex.mapActions(['fetch'])
    }
</script>

<template>
    <div class="row justify-content-md-center">
        <div v-if="sprite">
            <legend>{{ $t('view_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                sprite: null
            }
        },
        computed: Vuex.mapState({
            items: state => state.items
        }),
        mounted () {
            this.$store.dispatch('first', this.$route.query.no).then((sprite) => {
                this.sprite = sprite.$distortion('read')
            })
        }
    }
</script>

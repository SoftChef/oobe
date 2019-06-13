<template>
    <div class="row justify-content-md-center">
        <div v-if="sprite">
            <legend>{{ $t('update_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
            <button
                type="button"
                class="btn btn-outline-primary mb-3"
                @click.stop="submit()">
                {{ $t('update') }}
            </button>
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
                this.sprite = sprite.$out().$distortion('update')
            })
        },
        methods: {
            submit() {
                let validate = this.sprite.$validate()
                if (validate.success) {
                    this.sprite.$revive()
                    this.$router.push({ name: 'commodity.list' })
                } else {
                    alert(JSON.stringify(validate.result, null, 4))
                }
            }
        },
        destroyed () {
            if (this.sprite.$live) {
                this.sprite.$dead()
            }
        }
    }
</script>

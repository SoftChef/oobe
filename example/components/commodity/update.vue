<template>
    <div v-if="sprite" class="row justify-content-md-center">
        <div v-if="error" v-html="error"></div>
        <div v-else-if="!sprite.$ready">Loading...</div>
        <div v-else>
            <legend>{{ $t('update_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
            <button
                type="button"
                class="btn btn-outline-primary mb-3"
                :disabled="!sprite.$isChange()"
                @click.stop="submit()">
                {{ $t('update') }}
            </button>
        </div>
    </div>
</template>

<script>
    module.exports = {
        computed: Vuex.mapGetters(['sprite', 'error']),
        mounted () {
            this.fetch(this.$route.query.id)
            this.sprite.$on('$ready', ({ listener }) => {
                this.sprite.$dist('update')
                listener.off()
            })
        },
        methods: {
            ...Vuex.mapActions(['fetch']),
            submit() {
                let validate = this.sprite.$validate()
                if (validate.success) {
                    this.$store.dispatch('update', this.sprite.$export())
                    this.$router.push({ name: 'commodity.list' })
                } else {
                    alert(JSON.stringify(validate.result, null, 4))
                }
            }
        }
    }
</script>

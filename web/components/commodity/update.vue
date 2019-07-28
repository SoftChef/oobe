<template>
    <div class="row justify-content-md-center">
        <div v-if="!sprite">Loading...</div>
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
        data() {
            return {
                sprite: this.$oobe.make('shop', 'commodity').$dist('update')
            }
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
        },
        mounted () {
            this.fetch(this.$route.query.id)
                .then((data) => {
                    this.sprite.$born(data)
                })
        }
    }
</script>

<template>
    <div class="row justify-content-md-center">
        <div>
            <legend>{{ $t('create_commodity') }}</legend>
            <commodity-form :sprite="sprite"></commodity-form>
            <button
                type="button"
                class="btn btn-outline-primary mb-3"
                @click.stop="submit()">
                {{ $t('create') }}
            </button>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                sprite: this.$oobe.make('shop', 'commodity').$born().$dist('create')
            }
        },
        methods: {
            submit() {
                let validate = this.sprite.$validate()
                if (validate.success) {
                    this.$store.dispatch('create', this.sprite.$export())
                    this.$router.push({ name: 'commodity.list' })
                } else {
                    alert(JSON.stringify(validate.result, null, 4))
                }
            }
        }
    }
</script>

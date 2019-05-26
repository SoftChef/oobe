<template>
    <div class="pa-4">
        <div class="title mb-4">{{ $t('create_user') }}</div>
        <self-form :sprite="sprite" class="mb-4"></self-form>
        <v-btn class="ml-0" small color="success" @click.stop="submit">Create</v-btn>
        <v-btn class="ml-0" small color="white" :to="{ name: 'home' }">Exit</v-btn>
    </div>
</template>

<script>
import Form from './Form.vue'

export default {
    data() {
        return {
            sprite: this.$oobe.make('User', 'user').$distortion('create')
        }
    },
    methods: {
        submit() {
            this.$store.dispatch('addUser', this.sprite.$export())
            this.$router.push({ name: 'home' })
        }
    },
    components: {
        'self-form': Form
    }
}
</script>

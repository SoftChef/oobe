<template>
    <div class="pa-4">
        <div class="title mb-4">{{ $t('update_user') }}</div>
        <self-form v-if="sprite" :sprite="sprite" class="mb-4"></self-form>
        <v-btn class="ml-0" small color="success" @click.stop="submit" :disabled="!sprite.$isChange()">Update</v-btn>
        <v-btn class="ml-0" small color="white" @click.stop="sprite.$reset()">Reset</v-btn>
        <v-btn class="ml-0" small color="white" :to="{ name: 'home' }">Exit</v-btn>
    </div>
</template>

<script>
import Form from './Form.vue'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            sprite: null
        }
    },
    mounted() {
        let id = this.$route.query.id
        let sprite = this.users.find(s => s.id === id)
        this.sprite = sprite.$out().$distortion('update')
    },
    methods: {
        submit() {
            this.sprite.$revive()
            this.$router.push({ name: 'home' })
        }
    },
    computed: mapState({
        users: 'users'
    }),
    components: {
        'self-form': Form
    },
    destroyed() {
        if (this.sprite.$live) {
            this.sprite.$dead()
        }
    }
}
</script>

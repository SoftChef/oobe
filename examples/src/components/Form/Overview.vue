<template>
    <div class="pa-4">
        <div class="title mb-4">{{ $t('overview_user') }}</div>
        <self-form v-if="sprite" :sprite="sprite" class="mb-4"></self-form>
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
        this.sprite = this.users.find(s => s.id === id).$distortion('read')
    },
    computed: mapState({
        users: 'users'
    }),
    components: {
        'self-form': Form
    }
}
</script>

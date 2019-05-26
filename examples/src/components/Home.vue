<template>
    <div class="pa-4">
        <v-btn class="ml-0 mb-4" small color="success" :to="{ name: 'create' }">Create User</v-btn>
        <v-card
            v-for="(user, index) in users"
            class="pl-4 mb-2"
            :key="index + 'u'">
            <v-layout align-center>
                {{ user.name }}
                <v-spacer></v-spacer>
                <v-btn icon :to="{ name: 'overview', query: { id: user.id } }">
                    <v-icon>visibility</v-icon>
                </v-btn>
                <v-btn icon :to="{ name: 'update', query: { id: user.id } }">
                    <v-icon>edit</v-icon>
                </v-btn>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: mapState({
        users: 'users'
    })
}
</script>

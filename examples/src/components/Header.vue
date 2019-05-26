<template>
    <div>
        <app-navigation ref="nav"></app-navigation>
        <v-toolbar color="white" app flat>
            <v-btn icon @click.stop="openNav()">
                <v-icon>menu</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        methods: {
            openNav() {
                this.$refs.nav.open = !this.$refs.nav.open
            }
        }
    }
</script>

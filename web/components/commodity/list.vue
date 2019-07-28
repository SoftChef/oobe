<template>
    <div class="container">
        <button
            type="button"
            class="btn btn-outline-primary mb-3"
            @click.stop="push({name: 'commodity.create'})">
            {{ $t('create') }}
        </button>
        <div v-if="!list">Loading...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th scope="col">{{ $oobe.meg('$shop.id') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.name') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.price') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.tags') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.categories') }}</th>
                    <th scope="col">{{ $t('control') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in list" :key="'key' + index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.$views.tags }}</td>
                    <td>{{ item.$views.categories }}</td>
                    <td>
                        <button type="button" @click.stop="push({name: 'commodity.overview', query: { id: item.id }})">{{ $t('view') }}</button>
                        <button type="button" @click.stop="push({name: 'commodity.update', query: { id: item.id }})">{{ $t('edit') }}</button>
                        <button type="button" @click.stop="remove(item.id)">{{ $t('delete') }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    module.exports = {
        mounted () {
            this.fetchList()
        },
        methods: Vuex.mapActions(['fetchList', 'remove']),
        computed: Vuex.mapGetters(['list']),
        destroyed() {
            this.$store.commit('destroyed')
        }
    }
</script>

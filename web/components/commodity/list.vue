<template>
    <div class="container">
        <button
            type="button"
            class="btn btn-outline-primary mb-3"
            @click.stop="push({name: 'commodity.create'})">
            {{ $t('create') }}
        </button>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">{{ $oobe.meg('$shop.no') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.name') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.price') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.tags') }}</th>
                    <th scope="col">{{ $oobe.meg('$shop.categories') }}</th>
                    <th scope="col">{{ $t('control') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="'key' + index">
                    <td>{{ item.no }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.$views.tags }}</td>
                    <td>{{ item.$views.categories }}</td>
                    <td>
                        <button type="button" @click.stop="push({name: 'commodity.overview', query: { no: item.no }})">{{ $t('view') }}</button>
                        <button type="button" @click.stop="push({name: 'commodity.update', query: { no: item.no }})">{{ $t('edit') }}</button>
                        <button type="button" @click.stop="items.splice(index, 1)">{{ $t('delete') }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    module.exports = {
        computed: Vuex.mapState({
            items: state => state.items
        })
    }
</script>

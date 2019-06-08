<template>
    <form class="form-group" v-if="sprite && sprite.$ready">
        <!-- No -->
        <div class="mb-2" v-show="sprite.$show('no')">
            <label>{{sprite.$meg('no')}}：</label><br>
            <input type="text" :disabled="sprite.$isFixed('no')" v-model="sprite.no">
        </div>
        <!-- Name -->
        <div class="mb-2" v-show="sprite.$show('name')">
            <label>{{sprite.$meg('name')}}：</label><br>
            <input type="text" :disabled="sprite.$isFixed('name')" v-model="sprite.name">
        </div>
        <!-- Price -->
        <div class="mb-2" v-show="sprite.$show('price')">
            <label>{{sprite.$meg('price')}}：</label><br>
            <input type="text" :disabled="sprite.$isFixed('price')" v-model="sprite.price">
        </div>
        <!-- Tags -->
        <div class="mb-2" v-show="sprite.$show('tags')">
            <label>{{sprite.$meg('tags')}}：</label><br>
            <div class="mb-2" v-for="(item, index) in sprite.tags" :key="index + 'key'">
                <input
                    type="text"
                    :disabled="sprite.$isFixed('tags')"
                    v-model="sprite.tags[index]">
                <button
                    type="button"
                    v-if="!sprite.$isFixed('tags')"
                    @click.stop="sprite.$fn.deleteTag(index)">
                    {{ $t('delete') }}
                </button>
            </div>
            <button
                type="button"
                v-if="!sprite.$isFixed('tags')"
                @click.stop="sprite.$fn.addTag()">
                {{ $t('add') }}
            </button>
        </div>
        <!-- Categories -->
        <div class="mb-2" v-show="sprite.$show('categories')">
            <label>{{sprite.$meg('categories')}}：</label><br>
            <div class="form-check" v-for="(item, index) in sprite.$configs.commodityCategories" :key="index + 'c'">
                <input
                    :disabled="sprite.$isFixed('categories')"
                    :id="index + 'categories'"
                    :value="item.value"
                    class="form-check-input"
                    type="checkbox"
                    v-model="sprite.categories">
                <label :for="index + 'categories'">
                    {{ sprite.$meg(item.text) }}
                </label>
            </div>
        </div>
    </form>
</template>

<script>
    module.exports = {
        props: ['sprite']
    }
</script>

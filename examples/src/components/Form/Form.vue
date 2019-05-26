<template>
    <v-card class="pa-4">
        <v-form>
            <v-text-field
                v-show="sprite.$show('id')"
                v-model="sprite.id"
                label="id"
                :disabled="true">
            </v-text-field>
            <v-text-field
                v-show="sprite.$show('name')"
                v-model="sprite.name"
                :label="sprite.$meg('$name')"
                :disabled="sprite.$isFixed('name')">
            </v-text-field>
            <v-text-field
                v-show="sprite.$show('email')"
                v-model="sprite.email"
                :label="sprite.$meg('$email')"
                :disabled="sprite.$isFixed('email')">
            </v-text-field>
            <v-text-field
                v-show="sprite.$show('country_code')"
                v-model="sprite.country_code"
                :label="sprite.$meg('$country_code')"
                :disabled="sprite.$isFixed('country_code')">
            </v-text-field>
            <v-text-field
                v-show="sprite.$show('phone_number')"
                v-model="sprite.phone_number"
                :label="sprite.$meg('$phone_number')"
                :disabled="sprite.$isFixed('phone_number')">
            </v-text-field>
            <v-checkbox
                v-show="sprite.$show('driving_license')"
                v-model="sprite.driving_license"
                :disabled="sprite.$isFixed('driving_license')"
                label="小客車"
                value="小客車">
            </v-checkbox>
            <v-checkbox
                v-show="sprite.$show('driving_license')"
                v-model="sprite.driving_license"
                :disabled="sprite.$isFixed('driving_license')"
                label="大客車"
                value="大客車">
            </v-checkbox>
            <v-checkbox
                v-show="sprite.$show('driving_license')"
                v-model="sprite.driving_license"
                :disabled="sprite.$isFixed('driving_license')"
                label="普悠瑪"
                value="普悠瑪">
            </v-checkbox>
        </v-form>
    </v-card>
</template>

<script>
export default {
    props: {
        sprite: {
            required: true
        }
    }
}
</script>

export default {
    body() {
        return {
            id: null,
            name: '',
            email: '',
            country_code: '',
            phone_number: '',
            driving_license: []
        }
    },

    rules: {},

    methods: {},

    states: {
        read: {
            fixed: '*'
        },
        create: {
            hidden: ['id'],
            export() {
                let data = this.$toOrigin()
                data.id = Date.now()
                return data
            }
        },
        update: {
            fixed: ['id']
        }
    }
}

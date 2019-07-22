module.exports = {
    body() {
        return {
            name: ''
        }
    },

    self() {
        return {
            name: this.name,
            test: 'test'
        }
    },

    refs: {
        attributes: 'attributes'
    },

    rules: {
        name: [
            '#sc.require',
            'alphanumeric'
        ]
    },

    views: {
        testViews() { return this.name + 'test' }
    },

    born(rawData) {
        return {
            name: rawData['Username'],
            watchTest: '',
            attributes: rawData['UserAttributes']
        }
    },

    create() {},

    origin() {
        return {
            Username: this.name,
            UserAttributes: this.attributes.$toOrigin()
        }
    },

    methods: {
        getName() {
            return this.name
        }
    },

    states: {
        read: {
            fixed: [],
            export() {
                return this.$toOrigin()
            }
        },
        create: {
            fixed: ['name'],
            hidden: ['name'],
            export() {
                return 'test'
            }
        },
        update: {
            fixed: [],
            export() {
                let data = this.$toOrigin()
                delete data.Username
                return data
            }
        },
        delete: {
            export() {
                return 'delete'
            }
        }
    }
}

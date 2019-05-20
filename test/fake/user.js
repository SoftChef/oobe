module.exports = {
    body() {
        return {
            name: '',
            watchTest: '',
            computedTest: ''
        }
    },

    refs: {
        attributes: 'attributes'
    },

    rules: {
        name: [
            '[s]require',
            '$alphanumeric'
        ]
    },

    computed: {
        test: {
            set(value) {
                this.computedTest = value * 2
            },
            get() {
                return this.computedTest
            }
        }
    },

    watch: {
        name(oldValue, newVale) {
            this.watchTest = oldValue + newVale
        }
    },

    reborn(rawData) {
        return {
            name: rawData['Username'],
            watchTest: '',
            computedTest: '',
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

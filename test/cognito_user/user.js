module.exports = {
    body() {
        return {
            name: ''
        }
    },

    refs: {
        attributes: 'attributes'
    },

    rules: {
        name: ['@require', '$alphanumeric']
    },

    reborn(rawData) {
        return {
            name: rawData['Username'],
            attributes: rawData['UserAttributes']
        }
    },

    origin() {
        return {
            Username: this.name,
            UserAttributes: this.attributes.$toOrigin()
        }
    },

    methods: {
        toCsv() {
            return {
                '使用者名稱': this.name
            }
        }
    },

    distortion: {
        read: {
            fixed: [],
            export() {
                return this.$toOrigin()
            }
        },
        create: {
            fixed: ['name'],
            export() {
                return 'AAA'
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
            }
        }
    }
}

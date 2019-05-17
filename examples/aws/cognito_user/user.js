module.exports = {
    body() {
        return {
            name: ''
        }
    },

    refs: {
        attributes: 'attributes'
    },

    rules: {},

    reborn(rawData) {
        return {
            name: rawData['Username'],
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
        getSubId() {
            return this.attributes.sub
        }
    },

    states: {}
}

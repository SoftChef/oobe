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

    origin() {
        return {
            Username: this.name,
            UserAttributes: this.attributes.$toOrigin()
        }
    },

    methods: {},

    distortion: {}
}

module.exports = {
    body() {
        return {
            'sub': '',
            'name': '',
            'email': '',
            'phone_number': ''
        }
    },

    reborn(rawData) {
        let target = []
        for (let attr of rawData) {
            target[attr.Name] = attr.Value
        }
        return target
    },

    origin() {
        let body = this.$body()
        let target = []
        for (let key in body) {
            target.push({ Name: key, Value: body[key] })
        }
        return target
    },

    methods: {},

    distortion: {}
}

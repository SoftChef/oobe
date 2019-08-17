module.exports = {
    body() {
        return {
            'sub': '',
            'name': '',
            'email': '',
            'phone_number': '',
            'custom:level': 'user',
            'custom:country_code': ''
        }
    },

    born(data) {
        let target = []
        for (let attr of data) {
            target[attr.Name] = attr.Value
        }
        let country_code = target['custom:country_code']
        target.phone_number = target.phone_number.replace(country_code, '')
        return target
    },

    origin() {
        let body = this.$body()
        let target = []
        body.phone_number = body['custom:country_code'] + body.phone_number
        for (let key in body) {
            target.push({
                Name: key,
                Value: body[key]
            })
        }
        return target
    },

    methods: {
    },

    dists: {
        read: {},
        create: {},
        update: {},
        delete: {}
    }
}

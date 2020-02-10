module.exports = {
    map: {
        name: 'string'
    },

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

    defaultView({ key }) {
        return key
    },

    born(rawData) {
        return {
            name: rawData['Username'],
            watchTest: '',
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
        getName() {
            return this.name
        }
    },

    loaders: {
        name(done) {
            this.name = '456'
            setTimeout(() => done(), 100)
        },
        nameError(done, error) {
            setTimeout(() => {
                error('OuO')
            }, 100)
        }
    },

    collection: {
        key: sprite => sprite.name,
        write({ key, sprite, success, reject }) {
            if (key === '123456789') {
                return reject('test')
            }
            success()
        },
        writeAfter({ sprite }) {
            sprite.after = true
        },
        views: {
            names() {
                return this.items[0].name + this.items[1].name
            }
        },
        methods: {
            size() {
                return this.size
            }
        },
        loaders: {
            name(done) {
                setTimeout(() => {
                    this.forEach(sprite => {
                        sprite.name = '456'
                    })
                    done()
                }, 100)
            }
        }
    },

    dists: {
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
            export(text = '') {
                return 'delete' + text
            }
        }
    }
}

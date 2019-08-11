export default {
    body() {
        return {
            id: this.$helper.generateId(),
            name: '',
            tags: [],
            price: 0,
            createdAt: Date.now(),
            categories: []
        }
    },

    rules: {
        id: ['#sc.require'],
        name: ['#sc.require'],
        price: ['#sc.require', '#sc.number'],
        categories: ['#sc.require']
    },

    methods: {
        addTag() {
            this.tags.push('')
        },
        deleteTag(index) {
            this.tags.splice(index, 1)
        }
    },

    views: {
        tags() {
            return this.tags.join(', ')
        },
        createdAt() {
            return this.$utils.moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        categories() {
            let output = []
            for (let name of this.categories) {
                output.push(this.$meg(name))
            }
            return output.join(', ')
        }
    },

    states: {
        read: {
            fixed: '*'
        },
        create: {
            fixed: ['id'],
            hidden: ['createdAt']
        },
        update: {
            fixed: ['id', 'name']
        }
    },

    collection: {
        key: sprite => sprite.id
    }
}

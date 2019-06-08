export default {
    body() {
        return {
            no: 0,
            name: '',
            tags: [],
            price: 0,
            categories: []
        }
    },

    rules: {
        no: ['#sc.require', '#sc.number'],
        name: ['#sc.require'],
        price: ['#sc.require', '#sc.number'],
        categories: ['#sc.require']
    },

    watch: {
        no(value) {
            return Number(value)
        },
        price(value) {
            return Number(value)
        }
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
        tags() { return this.tags.join(', ') },
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
            fixed: ['no']
        },
        update: {
            fixed: ['no', 'name']
        }
    }
}

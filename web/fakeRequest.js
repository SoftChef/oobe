class Ajax {
    constructor() {
        this.database = new Map()
    }

    get(key) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database.get(key))
            }, 500)
        })
    }

    list() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.database.values()])
            }, 500)
        })
    }

    create(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database.set(data.id, data))
            }, 500)
        })
    }

    update(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let target = this.database.get(data.id)
                resolve(this.database.set(data.id, Object.assign(target, data)))
            }, 500)
        })
    }

    remove(key) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database.delete(key))
            }, 500)
        })
    }
}

export default new Ajax()

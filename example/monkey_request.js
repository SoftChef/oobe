class Ajax {
    constructor() {
        this.database = new Map()
    }

    get(key) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let data = this.database.get(key)
                if (data) {
                    resolve(data)
                } else {
                    reject(new Error('not found'))
                }
            }, 250)
        })
    }

    list() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.database.values()])
            }, 250)
        })
    }

    create(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database.set(data.id, data))
            }, 250)
        })
    }

    update(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let target = this.database.get(data.id)
                resolve(this.database.set(data.id, Object.assign(target, data)))
            }, 250)
        })
    }

    remove(key) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.database.delete(key))
            }, 250)
        })
    }
}

export default new Ajax()

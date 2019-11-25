class Queue {
    constructor() {
        this.events = []
        this.count = 0
        this.interval = null
    }

    push(event) {
        this.events.push(event)
        this.count += 1
        if (this.interval == null) {
            this.start()
        }
    }

    start() {
        this.interval = setInterval(() => {
            for (let i = 0; i < 15; i++) {
                let event = this.events.shift()
                if (event) {
                    event()
                } else {
                    break
                }
            }
            if (this.events.length === 0) {
                clearInterval(this.interval)
                this.interval = null
            }
        }, 1)
    }
}

module.exports = new Queue()

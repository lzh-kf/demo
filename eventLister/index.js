class EventLister {
    constructor() {
        this.handler = {}
    }
    resgiterEvent (eventName, callback) {
        const item = this.handler[eventName]
        if (item) {
            item.push(callback)
        } else {
            this.handler[eventName] = [callback]
        }
    }
    emit (eventName, ...args) {
        Promise.resolve().then(() => {
            const item = this.handler[eventName]
            item && item.forEach(callback => callback(args))
        })
    }
    unResgiterEvent (eventName) {
        if (this.handler[eventName]) {
            delete this.handler[eventName]
        }
    }
}
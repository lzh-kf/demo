const hander = new Map()
class EventLister {
    resgiterEvent (eventName, callback) {
        if (hander.has(eventName)) {
            throw new Error(`${eventName} is excit `)
        } else {
            hander.set(eventName, callback)
        }
    }
    emit (eventName, ...args) {
        Promise.resolve().then(() => {
            hander.get(eventName)?.(args)
        })
    }
    unResgiterEvent (eventName) {
        if (hander.has(eventName)) {
            hander.delete(eventName)
        }
    }
}
class Store {
    constructor(options = {}) {
        if (isObject(options.state)) {
            this.state = dataProxy.bind(this)(options.state)
        }
        // 是否开启严格模式
        this.strict = options.strict
        this.mutations = options.mutations
        this.actions = options.actions
        this.AllTypeCallbacks = []
        this.MutationCallbacks = new Map()
        this._resolve = new Map()
        this.commitFlag = false
        this.setModules(options)
        this.bindContext()
    }
    setModules ({ modules }) {
        if (modules && Object.keys(modules).length) {
            this.modules = {}
            for (const [key, value] of Object.entries(modules)) {
                if (value instanceof Store) {
                    this.modules[key] = value
                } else {
                    this.modules = null
                    throw new Error(`module ${key} is not Store instance`)
                }
            }
        }
    }
    bindContext () {
        const methods = ['commit', 'dispatch', 'subscribe', 'unSubscribe', 'subscribeMutation', 'unSubscribeMutation']
        methods.forEach(method => this[method] = this[method].bind(this))
    }
    commit (type, value) {
        Promise.resolve().then(() => {
            if (this.mutations) {
                const currentMutation = this.mutations[type]
                if (currentMutation) {
                    this.commitFlag = true
                    currentMutation(this.state, value)
                    this.commitFlag = false
                    const currentMutationCallback = this.MutationCallbacks.get(type)
                    currentMutationCallback && currentMutationCallback.forEach(item => item(value))
                    this.AllTypeCallbacks.forEach(item => item(type, this.state))
                    const currentReslve = this._resolve.get(value)
                    if (currentReslve) {
                        currentReslve(value)
                        this._resolve.delete(value)
                    }
                } else {
                    handleError(type)
                }
            } else {
                throw new Error('mutations object is not defined')
            }
        })
    }
    dispatch (type, value) {
        return new Promise((resolve) => {
            if (this.actions) {
                const currentAction = this.actions[type]
                if (currentAction) {
                    currentAction(this, value)
                    this._resolve.set(value, resolve)
                } else {
                    handleError(type)
                }
            } else {
                throw new Error('actions object is not defined')
            }
        })
    }
    subscribe (callback) {
        if (isFunction(callback)) {
            let { length } = this.AllTypeCallbacks
            const isExcit = this.AllTypeCallbacks.find(item => item === callback)
            if (!isExcit) {
                length = this.AllTypeCallbacks.push(callback)
            }
            return length - 1
        } else {
            throw new Error('argument[0] must is funcion')
        }
    }
    unSubscribe (index) {
        this.AllTypeCallbacks[index] && this.AllTypeCallbacks.splice(index, 1)
    }
    subscribeMutation (type, callback) {
        if (isFunction(callback)) {
            const item = this.MutationCallbacks.get(type) || []
            item.push(callback)
            this.MutationCallbacks.set(type, item)
        } else {
            throw new Error('argument[1] must is funcion')
        }
    }
    unSubscribeMutation (type) {
        if (this.MutationCallbacks.get(type)) {
            this.MutationCallbacks.delete(type)
        } else {
            throw new Error(`no subscribe ${type} event`)
        }
    }
}




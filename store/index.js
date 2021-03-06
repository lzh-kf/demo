const setProxy = Symbol('setProxy')

const cloneData = Symbol('cloneData')
class Store {

    constructor(options = {}) {
        this.state = this[cloneData](options.state)
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
        this.resetWriteArrayMethods()
    }

    [setProxy] (data) {
        const that = this
        data = new Proxy(data, {
            get (target, propKey, receiver) {
                return Reflect.get(target, propKey, receiver)
            },
            set (target, propKey, value, receiver) {
                if (!that.strict || that.commitFlag) {
                    return Reflect.set(target, propKey, value, receiver)
                } else {
                    console.error('just can use commit method change state')
                    return false
                }
            },
        })
        return data
    }

    [cloneData] (data, tempData = new WeakMap()) {
        // 循环引用
        if (tempData.has(data)) {
            return tempData.get(data)
        }
        if (isArray(data)) {
            return this[setProxy](data.map((item) => {
                return this[cloneData](item, tempData)
            }))
        } else if (isObject(data)) {
            let result = {}
            tempData.set(data, result)
            // 不使用for in 的原因 是因为 他会遍历自己继承的可枚举的属性 但是object.keys 只会遍历自身的属性
            Object.keys(data).forEach(key => {
                result[key] = this[cloneData](data[key], tempData)
            })
            // 遍历symbol做为key的值
            Object.getOwnPropertySymbols(data).forEach(key => {
                result[key] = this[cloneData](data[key], tempData)
            })
            return this[setProxy](result)
        } else {
            return data
        }
    }

    resetWriteArrayMethods () {
        const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort']
        const context = this
        methods.forEach(key => {
            const currentMethods = Array.prototype[key]
            Array.prototype[key] = function (...args) {
                if (!context.strict || context.commitFlag) {
                    return currentMethods.apply(this, args)
                } else {
                    console.error('just can use commit method change state')
                }
            }
        })
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
        const methods = ['commit', 'dispatch', 'subscribe', 'unSubscribe', 'subscribeMutation', 'unSubscribeMutation', 'resetWriteArrayMethods']
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




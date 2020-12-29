class Store {
    constructor(options) {
        // 对state做拦截 不允许通过其他方式修改state  只允许通过commit方法修改state
        if (options.state) {
            this.state = deepProxy(options.state, this)
        }
        this.mutations = options.mutations
        this.actions = options.actions
        // 订阅收集回调函数
        // Mutation回调收集
        this.MutationCallbacks = new Map()
        // 所有的类型回调收集（不包含Mutation类型）
        this.AllTypeCallbacks = []
        // resolve收集对象，主要是在调用action是没办法知道 action里面是同步还是异步操作，
        // 所以dispatch函数return的promise  没办法里面resolve，只能先存储起来，
        // 等调用commit的时候，在调用，这样才能保证在订阅的函数里面
        // 拿到最新的state
        this._resolve = new Map()
        // 修改标识
        this.commitFlag = false
        // 模块
        if (options.modules) {
            this.modules = {}
            for (let [key, value] of Object.entries(options.modules)) {
                if (value instanceof Store) {
                    this.modules[key] = value
                } else {
                    throw new Error(`module ${key} is not Store instance`)
                }
            }
        }
        // 防止解构赋值的时候使用丢失上下文
        const methods = ['commit', 'dispatch', 'subscribe', 'unSubscribe', 'subscribeMutation', 'unSubscribeMutation']
        methods.forEach(method => this[method] = this[method].bind(this))
    }
    // 通过commit 修改state值
    commit (type, value) {
        // 这里使用promise.resolve  是因为订阅的时候 订阅代码是同步代码，这里使用resolve，
        // 可以保证所有的订阅函数一定注册完成了，才会调用commit
        Promise.resolve().then(() => {
            if (this.mutations) {
                const currentMutation = this.mutations[type]
                if (currentMutation) {
                    this.commitFlag = true
                    currentMutation(this.state, value)
                    this.commitFlag = false
                    // 通知mutation订阅
                    const currentMutationCallback = this.MutationCallbacks.get(type)
                    currentMutationCallback && currentMutationCallback.forEach(item => item(value))
                    // 通知全部的订阅（不区分类型）
                    this.AllTypeCallbacks.forEach(item => item(type, this.state))
                    // 如果value映射到_resolve里面 则调用resolve，结束promise
                    const currentReslve = this._resolve.get(value)
                    if (currentReslve) {
                        currentReslve(value)
                        this._resolve.delete(value)
                    }
                } else {
                    errorHandler(type)
                }
            }
        })
    }
    // 异步调用action
    dispatch (type, value) {
        return new Promise((resolve) => {
            if (this.actions) {
                const currentAction = this.actions[type]
                if (currentAction) {
                    currentAction(this, value)
                    // 先把resolve存储起来，挂载到_resolve用value做映射（保持唯一性）（因为action一般是异步操作）
                    this._resolve.set(value, resolve)
                } else {
                    errorHandler(type)
                }
            }
        })
    }
    // 订阅全部
    subscribe (callback) {
        // 收集订阅函数
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
    // 取消订阅
    unSubscribe (index) {
        // 清除订阅函数
        this.AllTypeCallbacks[index] && this.AllTypeCallbacks.splice(index, 1)
    }
    // 订阅mutation
    subscribeMutation (type, callback) {
        // 收集订阅函数
        if (isFunction(callback)) {
            const item = this.MutationCallbacks.get(type) || []
            item.push(callback)
            this.MutationCallbacks.set(type, item)
        } else {
            throw new Error('argument[0] must is funcion')
        }
    }
    // 取消订阅mutation
    unSubscribeMutation (type) {
        if (this.MutationCallbacks.get(type)) {
            this.MutationCallbacks.delete(type)
        } else {
            console.error(`no subscribe ${type} event`)
        }
    }
}




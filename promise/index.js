
const status = {
    pending: Symbol('pending'),
    fulfilled: Symbol('fulfilled'),
    rejected: Symbol('rejected')
}

const { log, error } = console

function isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

function isPromise (value) {
    return typeof value === 'object' && typeof value.then === 'function'
}

class CustomPromise {
    constructor(hander) {
        if (!isFunction(hander)) {
            throw new Error('hander is not a funtion')
        }
        this.status = status.pending
        this.thenCallback = {}
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        this.finally = this.finally.bind(this)
        this.then = this.then.bind(this)
        this.catch = this.catch.bind(this)
        hander(this.resolve, this.reject)
    }
    resolve (value) {
        if (this.status === status.pending) {
            this.status = status.fulfilled
            this.value = value
            this.notify()
        }
    }
    reject (value) {
        if (this.status === status.pending) {
            this.status = status.rejected
            this.value = value
            this.notify()
        }
    }
    notify (q) {
        if (this.status === status.pending) {
            return false
        }
        const { successCallback, errorCallback } = this.thenCallback
        if (this.status === status.fulfilled && successCallback) {
            try {
                const that = this
                // 如果当前值是promise实例 则调用当前value的then|catch 回调 根据当前值 来决定 当前是成功还是失败
                if (this.value instanceof CustomPromise) {
                    this.value.then(value => {
                        that._resolve && that._resolve(successCallback(value))
                    }).catch(error => {
                        that._reject && that._reject(error)
                    }).finally(() => {
                    })
                } else {
                    this._resolve && this._resolve(successCallback(this.value))
                }
            } catch (error) {
                this._reject && this._reject(this.error)
            }
        } else if (this.status === status.rejected) {
            if (errorCallback) {
                errorCallback(this.value)
            } else {
                this._reject && this._reject(this.value)
            }
        }
        this.thenCallback = {}
    }
    then (successCallback, errorCallback) {
        this.thenCallback = {
            successCallback,
            errorCallback
        }
        return new CustomPromise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
            this.notify()
        })
    }
    catch (errorCallback) {
        this.thenCallback = {
            errorCallback
        }
        return new CustomPromise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
            this.notify()
        })
    }
    // 暂时不知道怎么实现 
    finally (finallyCallback) {
    }
    static resolve (value) {
        return new CustomPromise((resolve) => {
            resolve(value)
        })
    }
    static reject (value) {
        return new CustomPromise((resolve, reject) => {
            reject(value)
        })
    }
    static all (promises) {
        if (isFunction(promises[Symbol.iterator])) {
            return new CustomPromise((resolve, reject) => {
                let index = 0
                const { length } = promises
                const result = []
                for (let element of promises.values()) {
                    if (!isPromise(element)) {
                        element = CustomPromise.resolve(element)
                    }
                    element.then(res => {
                        result.push(res)
                        index++
                        if (index === length) {
                            resolve(result)
                        }
                    }).catch(error => {
                        reject([error])
                    })
                }
            })
        } else {
            throw new Error('argument must has Symbol.iterator')
        }
    }
    static race (promises) {
        if (isFunction(promises[Symbol.iterator])) {
            return new CustomPromise((resolve, reject) => {
                for (let element of promises.values()) {
                    if (!isPromise(element)) {
                        element = CustomPromise.resolve(element)
                    }
                    element.then(resolve).catch(reject)
                }
            })
        } else {
            throw new Error('argument must has Symbol.iterator')
        }
    }

    static allSettled (promises) {
        if (isFunction(promises[Symbol.iterator])) {
            return new CustomPromise((resolve) => {
                let index = 0
                const { length } = promises
                const result = []
                for (let element of promises.values()) {
                    if (!isPromise(element)) {
                        element = CustomPromise.resolve(element)
                    }
                    element.then(res => {
                        result.push({
                            status: 'fulfilled',
                            value: res
                        })
                        index++
                        if (index === length) {
                            resolve(result)
                        }
                    }).catch(error => {
                        result.push({
                            status: 'rejected',
                            reason: error
                        })
                        index++
                        if (index === length) {
                            resolve(result)
                        }
                    })
                }
            })
        } else {
            throw new Error('argument must has Symbol.iterator')
        }
    }
}

const p1 = new CustomPromise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new CustomPromise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2
    .then(result => {
        console.log('res', result)
    })
    .catch(error => {
        console.log('error', error)
    })

function promise1 () {
    return new CustomPromise((resolve, reject) => {
        resolve('promise1')
    })
}

function promise2 () {
    return new CustomPromise((resolve, reject) => {
        resolve('promise2')
    })
}

function promise3 () {
    return new CustomPromise((resolve, reject) => {
        resolve('promise3')
    })
}

function promise4 () {
    return new CustomPromise((resolve, reject) => {
        reject('promise4')
    })
}

CustomPromise.race([promise1(), promise2(), promise3(), promise4()]).then(log).catch(error)

CustomPromise.all([promise1(), promise2(), promise3(), promise4()]).then(log).catch(error)

CustomPromise.allSettled([promise1(), promise2(), promise3(), promise4()]).then(log).catch(error)


CustomPromise.reject('rejected').catch(error)

CustomPromise.resolve('resolve').then(log)



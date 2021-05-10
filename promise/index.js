
const status = {
    pending: Symbol('pending'),
    fulfilled: Symbol('fulfilled'),
    rejected: Symbol('rejected')
}

function isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]'
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
    notify () {
        if (this.status === status.pending) {
            return false
        }
        const { successCallback, errorCallback } = this.thenCallback
        if (this.status === status.fulfilled && successCallback) {
            try {
                this._resolve(successCallback(this.value))
            } catch (error) {
                this._reject(error)
            }
        } else if (this.status === status.rejected) {
            if (errorCallback) {
                errorCallback(this.value)
            } else {
                this._reject(this.value)
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
}

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(456), 3000)
})

p2.then(result => console.log(result), (error) => {
    console.log('error', error)
}).catch(error => console.log(error)).then(() => {
})


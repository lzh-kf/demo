
const status = {
    pending: Symbol(),
    fulfilled: Symbol(),
    rejected: Symbol()
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
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        hander(this.resolve, this.reject)
    }
    resolve (value) {
        if (this.status === status.pending) {
            this.status = status.fulfilled
            this.value = value
        }
    }
    reject (value) {
        if (this.status === status.pending) {
            this.status = status.rejected
            this.value = value
        }
    }
    then (successCallback, errorCallback) {
        if (this.status === status.fulfilled && isFunction(successCallback)) {
            try {
                return new CustomPromise((resolve) => {
                    resolve(successCallback(this.value))
                })
            } catch (error) {
                this.status = status.rejected
                this.value = error
            }
        }
        if (this.status === status.rejected) {
            if (isFunction(errorCallback)) {
                errorCallback(this.value)
            } else {
                return new CustomPromise((resolve, reject) => {
                    reject(this.value)
                })
            }
        }
    }
    catch (errorCallback) {
        if (this.status === status.rejected && isFunction(errorCallback)) {
            errorCallback(this.value)
        }
    }
}

const testFn = () => {
    return new CustomPromise((resolve, reject) => {
        resolve('resolve')
    })
}

testFn().then(res => {
    console.log('res', res)
    throw new Error('fdsfs')
}).catch(error => {
    console.log('001error', error)
})
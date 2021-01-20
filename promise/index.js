class CustomPromise {
    constructor(hander) {
        if (typeof hander !== 'function') {
            throw new Error('hander is not a funtion')
        }
        this.status = 'pending'
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        hander(this.resolve, this.reject)
    }
    resolve (value) {
        if (this.status === 'pending') {
            this.status = 'fulfilled'
            this.value = value
        }
    }
    reject (value) {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.value = value
        }
    }
    then (successCallback, errorCallback) {
        if (this.status === 'fulfilled' && successCallback) {
            try {
                return new CustomPromise((resolve) => {
                    resolve(successCallback(this.value))
                })
            } catch (error) {
                this.status = 'rejected'
                this.value = error
            }
        }
        if (this.status === 'rejected') {
            if (errorCallback) {
                errorCallback(this.value)
            } else {
                return new CustomPromise((resolve, reject) => {
                    reject(this.value)
                })
            }
        }
    }
    catch (errorCallback) {
        if (this.status === 'rejected' && errorCallback) {
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
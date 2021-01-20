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
    resolve(value) {
        // 状态一旦修改 则不可更改
        if (this.status === 'pending') {
            this.status = 'fulfilled'
            this.value = value
        }
    }
    reject(value) {
        // 状态一旦修改 则不可更改
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.value = value
        }
    }
    then(successCallback, errorCallback) {
        if (this.status === 'fulfilled' && successCallback) {
            try {
                return new CustomPromise((resolve) => {
                    resolve(successCallback(this.value))
                })
            } catch (error) {
                // 捕捉异常，如果异常，则修改状态
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
    catch(errorCallback) {
        if (this.status === 'rejected' && errorCallback) {
            errorCallback(this.value)
        }
    }
}

const test = () => {
    return new CustomPromise((resolve, reject) => {
        resolve('resolve')
    })
}

test().then(res => {
    throw new Error('fdsfs')
}).catch(error => {
})
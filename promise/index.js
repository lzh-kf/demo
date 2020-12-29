function customPromise (hander) {
    if (typeof hander !== 'function') {
        throw new Error('hander is not a funtion')
    }
    console.log(this)
    customPromise.status = 'pending'
    customPromise.resolve = function (value) {
        // 状态一旦修改 则不可更改
        if (customPromise.status === 'pending') {
            customPromise.status = 'fulfilled'
            customPromise.value = value
        }
    }
    customPromise.reject = function (value) {
        if (customPromise.status === 'pending') {
            customPromise.status = 'rejected'
            customPromise.value = value
        }
    }
    hander(customPromise.resolve, customPromise.reject)
}

customPromise.prototype.then = function (successCallback, errorCallback) {
    if (customPromise.status === 'pending') {
        return new customPromise((resolve, reject) => { })
    }
    if (successCallback && customPromise.status === 'fulfilled') {
        try {
            const result = successCallback(customPromise.value)
            if (result) {
                return new customPromise((resolve, reject) => {
                    resolve(result)
                })
            }
        } catch (error) {
            customPromise.status = 'rejected'
            customPromise.value = error
        }
    }
    if (customPromise.status === 'rejected') {
        if (errorCallback) {
            errorCallback(customPromise.value)
        } else {
            return new customPromise((resolve, reject) => {
                reject(customPromise.value)
            })
        }
    }
}

customPromise.prototype.catch = function (errorCallback) {
    if (errorCallback && customPromise.status === 'rejected') {
        errorCallback(customPromise.value)
    }
}

const test = () => {
    return new customPromise((resolve, reject) => {
        resolve(123)
    })
}

test().then(res => {
    console.log(res)
    return res
}).then()
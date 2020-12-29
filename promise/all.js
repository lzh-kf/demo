function isPromise (value) {
    return typeof value === 'object' && typeof value.then === 'function'
}

Promise.Myall = function (promises) {
    if (Array.isArray(promises)) {
        let index = 0
        const { length } = promises
        const result = []
        return new Promise((resolve, reject) => {
            promises.forEach((promise) => {
                if (!isPromise(promise)) {
                    promise = Promise.resolve(promise)
                }
                promise.then(res => {
                    result.push(res)
                    index++
                    if (index === length) {
                        resolve(result)
                    }
                }).catch(error => {
                    result.push(error)
                    reject(result)
                })
            })
        })
    } else {
        throw new Error('arguments must is array')
    }
}

function promise1 () {
    return new Promise((resolve, reject) => {
        resolve('promise1')
    })
}

function promise2 () {
    return new Promise((resolve, reject) => {
        resolve('promise2')
    })
}

function promise3 () {
    return new Promise((resolve, reject) => {
        resolve('promise3')
    })
}

function promise4 () {
    return new Promise((resolve, reject) => {
        resolve('promise4')
    })
}

Promise.Myall([promise1(), promise2(), promise3(), promise4()]).then(res => {
    console.log('res', res)
}).catch(error => {
    console.log('error', error)
})



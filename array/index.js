// 重写高阶函数
Array.prototype.mEntries = function () {
    let index = 0
    const context = this
    return {
        next () {
            return {
                value: [index++, context[index - 1]]
            }
        }
    }
}

Array.prototype.mEvery = function (callback, context = window) {
    const { length } = this
    const data = this
    for (let i = 0; i < length; i++) {
        let value = callback.bind(context)(data[i], i, data)
        if (!value) {
            return false
        }
    }
    return true
}

Array.prototype.mFilter = function (callback, context = window) {
    const { length } = this
    const data = this
    let result = []
    for (let i = 0; i < length; i++) {
        const element = data[i]
        let value = callback.bind(context)(element, i, data)
        if (value) {
            result.push(element)
        }
    }
    return result
}

Array.prototype.mFind = function (callback, context = window) {
    const { length } = this
    const data = this
    for (let i = 0; i < length; i++) {
        const element = data[i]
        let value = callback.bind(context)(element, i, data)
        if (value) {
            return element
        }
    }
    return undefined
}

Array.prototype.mFindIndex = function (callback, context = window) {
    const { length } = this
    const data = this
    for (let i = 0; i < length; i++) {
        const element = data[i]
        let value = callback.bind(context)(element, i, data)
        if (value) {
            return i
        }
    }
    return -1
}

Array.prototype.mForEach = function (callback, context = window) {
    const { length } = this
    const data = this
    for (let i = 0; i < length; i++) {
        callback.bind(context)(data[i], i, data)
    }
}

Array.prototype.mMap = function (callback, context = window) {
    const { length } = this
    const data = this
    let result = []
    for (let i = 0; i < length; i++) {
        const value = callback.bind(context)(data[i], i, data)
        result.push(value)
    }
    return result
}

Array.prototype.mReduce = function (callback, initValue) {
    const { length } = this
    const data = this
    let accumulator = data[0]
    let i = 1
    if (initValue !== undefined) {
        accumulator = initValue
        i = 0
    }
    for (i; i < length; i++) {
        accumulator = callback(accumulator, data[i], i, data)
    }
    return accumulator
}

Array.prototype.mSome = function (callback, context = window) {
    const { length } = this
    const data = this
    for (let i = 0; i < length; i++) {
        const value = callback.bind(context)(data[i], i, data)
        if (value) {
            return true
        }
    }
    return false
}


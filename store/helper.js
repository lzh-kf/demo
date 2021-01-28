function handleError (type) {
    console.error(`${type} method is not defined, please checked`)
}

function isObject (value) {
    return typeof value === 'object' && typeof value !== null
}

function isArray (value) {
    return Array.isArray(value)
}

function isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

function setArrayProxy (data) {
    if (data[0] !== undefined && isObject(data[0])) {
        data.forEach(item => dataProxy.bind(this)(item))
    }
    return dataProxy.bind(this)(data)
}

function dataProxy (data) {
    const that = this
    return new Proxy(data, {
        get (target, propKey, receiver) {
            const value = target[propKey]
            if (isArray(value)) {
                target[propKey] = setArrayProxy.bind(that)(value)
            } else if (isObject(value)) {
                target[propKey] = dataProxy.bind(that)(value)
            }
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
    });
}

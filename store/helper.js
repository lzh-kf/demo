function errorHandler (type) {
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

function setArrayProxy (data, context) {
    // 如果是数组，默认第一个元素的数据结构和后面的数据结构一样
    if (data[0] !== undefined) {
        if (isObject(data[0])) {
            return data.map(item => {
                item = deepProxy(item, context)
                return item
            })
        }
    }
    return deepProxy(data, context)
}

function deepProxy (data, context) {
    return new Proxy(data, {
        get (target, propKey, receiver) {
            let value = target[propKey]
            if (isArray(value)) {
                target[propKey] = setArrayProxy(value, context)
            } else if (isObject(value)) {
                target[propKey] = deepProxy(value, context)
            }
            return Reflect.get(target, propKey, receiver)
        },
        set (target, propKey, value, receiver) {
            // 判断如果是通过commit提交的则可修改，否则抛出异常
            if (context.commitFlag) {
                return Reflect.set(target, propKey, value, receiver)
            } else {
                console.error('just can use commit method change state')
                return false
            }
        },
    });
}
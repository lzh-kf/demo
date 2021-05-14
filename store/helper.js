const { toString } = Object.prototype

function getDataType (value) {
    return toString.call(value)
}

function handleError (type) {
    console.error(`${type} method is not defined`)
}

function isObject (value) {
    return getDataType(value) === '[object Object]'
}

function isArray (value) {
    return getDataType(value) === '[object Array]'
}

function isFunction (value) {
    return getDataType(value) === '[object Function]'
}

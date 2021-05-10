
function handleError (type) {
    console.error(`${type} method is not defined`)
}

function isObject (value) {
    return typeof value === 'object' && value !== null
}

function isArray (value) {
    return Array.isArray(value)
}

function isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}


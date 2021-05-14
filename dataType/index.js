
const { toString } = Object.prototype

function getDataType (value) {
    return toString.call(value)
}

function isUndefined (value) {
    return getDataType(value) === '[object Undefined]'
}

function isNull (value) {
    return getDataType(value) === '[object Null]'
}

function isString (value) {
    return getDataType(value) === '[object String]'
}

function isNumber (value) {
    return getDataType(value) === '[object Number]'
}

function isBoolean (value) {
    return getDataType(value) === '[object Boolean]'
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

function isSymbol (value) {
    return getDataType(value) === '[object Symbol]'
}

function isSet (value) {
    return getDataType(value) === '[object Set]'
}

function isMap (value) {
    return getDataType(value) === '[object Map]'
}

function isBigInt (value) {
    return getDataType(value) === '[object BigInt]'
}

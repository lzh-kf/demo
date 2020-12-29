
const { toString } = Object.prototype

const dataType = (data) => toString.call(data).replace(']', '').split(' ')[1]

const types = ['Object', 'Number', 'Array', 'String', 'Function', 'Null', 'Undefined', 'Symbol', 'Set', 'Map', 'Promise']

types.forEach(item => window[`is${item}`] = (data) => dataType(data) === item)
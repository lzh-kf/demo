const array1 = ['a', 'b', 'c'];

Array.prototype.entries = function* (arr) {
    for (let i = 0; i < arr.length; i++) {
        yield [i, arr[i]];
    }
}

Array.prototype.every = function (callback) {
    for (let i = 0; i < arr.length; i++) {
        if (!callback(arr[i], i, arr)) {
            return false
        }
    }
    return false
}
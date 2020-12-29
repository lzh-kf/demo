function customNew (fn) {
    let result = {};
    result.__proto__ = fn.prototype;
    Object.defineProperty(result.__proto__, "constructor", {
        value: fn,
        writable: false,
        configurable: true,
    });
    const args = [];
    const { length } = arguments;
    for (let i = 1; i < length; i++) {
        args.push(arguments[i]);
    }
    return fn.call(result, ...args) || result;
}

const cacheMap = {
    0: localStorage,
    1: sessionStorage
};

const isObject = (value) => (typeof value === 'object' && value !== null)

const getValue = (key, type) => {
    let value = cacheMap[type][key];
    if (isObject(value)) {
        return JSON.stringify(value);
    } else {
        return value
    }
};

const setValue = (key, value, type) => {
    if ([undefined, ''].includes(value)) {
        cacheMap[type].removeItem(key);
    } else {
        if (isObject(value)) {
            cacheMap[type][key] = JSON.stringify(value);
        } else {
            cacheMap[type][key] = value;
        }
    }
    return true;
};

const returnProxy = type => {
    return new Proxy(
        {},
        {
            get (target, key) {
                return getValue(key, type);
            },
            set (target, key, value) {
                return setValue(key, value, type);
            }
        }
    );
};

// Storage工具类
const [setLocal, setSession] = [returnProxy(0), returnProxy(1)];
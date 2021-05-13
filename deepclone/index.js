const testData = {
    a: 123,
    [Symbol()]: 123456
  }
  
  testData.b = testData
  
  function isObject (value) {
    return typeof value === 'object' && value !== null
  }
  
  function deepClone (source, tempData = new WeakMap()) {
    // 循环引用
    if (tempData.has(source)) {
      return tempData.get(source)
    }
    if (Array.isArray(source)) {
      return source.map((value) => deepClone(value, tempData))
    } else if (isObject(source)) {
      let result = {}
      tempData.set(source, result)
      // 不使用for in 的原因 是因为 他会遍历自己继承的可枚举的属性 但是object.keys 只会遍历自身的属性
      Object.keys(source).forEach(key => {
        result[key] = deepClone(source[key], tempData)
      })
      // 遍历symbol做为key的值
      Object.getOwnPropertySymbols(source).forEach(key => {
        result[key] = deepClone(source[key], tempData)
      })
      return result
    } else {
      return source
    }
  }
  
  console.log(deepClone(testData))
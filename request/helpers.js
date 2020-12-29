const setHeaders = (headers, xhr) => {
    for (let [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value)
    }
}

const mergeConfig = (target, source) => {
    return { ...target, ...source }
}

const serializeParams = data => {
    let result = ''
    const length = Object.keys(data).length - 1
    let index = 0
    for (let [key, value] of Object.entries(data)) {
        if (index === length) {
            result += `${key}=${value}`
        } else {
            result += `${key}=${value}&`
        }
        index++
    }
    return result
}

const setConfig = (config) => {
    const defaultConfig = {
        async: true,
        headers: {},
        timeout: 5000
    }
    return { ...defaultConfig, ...config }
}

const setFormData = data => {
    let result = new FormData()
    for (let [key, value] of Object.entries(data)) {
        result.append(key, value)
    }
    return result
}

const parseResponse = (response) => JSON.parse(response.currentTarget.response)

const handlerErrorCallback = ({ context, resolve, reject, error }) => {
    if (context.interceptResponseErrorCallback) {
        let rejected
        try {
            rejected = context.interceptResponseErrorCallback(error)
            if (window.isPromise(rejected)) {
                rejected.then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            } else {
                reject(error)
            }
        } catch (error) {
            reject(error)
        }
    } else {
        reject(error)
    }
}

const handlerInterceptRequestCallback = ({ context, resolve, reject, config, xhr, data }) => {
    try {
        let promise
        if (context.interceptRequestCallback) {
            promise = context.interceptRequestCallback(config)
            if (window.isPromise(promise)) {
                promise.then(() => {
                    setHeaders(mergeConfig(context.defaultHeaders, config.headers), xhr)
                    xhr.send(data)
                }).catch(error => {
                    handlerErrorCallback({ context, resolve, reject, error })
                })
            } else {
                setHeaders(mergeConfig(context.defaultHeaders, config.headers), xhr)
                xhr.send(data)
            }
        }
    } catch (error) {
        handlerErrorCallback({ context, resolve, reject, error })
    }
}

const handlerInterceptResponseSuccessCallback = ({ context, resolve, reject, xhr, config }) => {
    xhr.addEventListener('load', (response) => {
        const currentResponse = parseResponse(response)
        if (context.interceptResponseSuccessCallback) {
            let promise
            try {
                promise = context.interceptResponseSuccessCallback({ config, response: currentResponse })
                // 如果响应拦截器return出promise  则调用，否则默认请求成功，调用resolve函数
                if (window.isPromise(promise)) {
                    promise.then(res => {
                        resolve(res)
                    }).catch(error => {
                        handlerErrorCallback({ context, resolve, reject, error })
                    })
                } else {
                    resolve(tempData)
                }
            } catch (error) {
                reject(error)
            }
        } else {
            resolve({ config, response: currentResponse })
        }
    });
}
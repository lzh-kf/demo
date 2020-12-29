class Request {
    constructor(options) {
        this.options = options || {}
        this.defaultHeaders = {
            'Content-type': "application/json;charset=UTF-8"
        }
        this.interceptRequestFlag = false
        this.interceptResponseFlag = false
    }
    sendRequest ({ method = "get", url, data = null, params = '', config }) {
        config = setConfig(config)
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.timeout = config.timeout
            const currentMethod = method.toUpperCase()
            let currentUrl = this.options.baseUrl + url
            if (currentMethod === 'GET') {
                currentUrl += '?' + params
            }
            xhr.open(currentMethod, currentUrl, config.async);
            // 请求拦截器
            if (this.interceptRequestFlag) {
                handlerInterceptRequestCallback({ context: this, resolve, reject, config, xhr, data })
            } else {
                setHeaders(mergeConfig(this.defaultHeaders, config.headers), xhr)
                xhr.send(data)
            }
            // 响应拦截器
            if (this.interceptResponseFlag) {
                handlerInterceptResponseSuccessCallback({ context: this, resolve, reject, config, xhr, config })
            } else {
                xhr.addEventListener('load', (response) => {
                    resolve(parseResponse(response))
                });
            }
            ['timeout', 'error'].forEach(event => {
                xhr.addEventListener(event, (error) => {
                    if (this.interceptResponseErrorCallback) {
                        handlerErrorCallback({ context: this, resolve, reject, error })
                    } else {
                        reject(error)
                    }
                });
            })
        })
    }
    // 请求拦截
    interceptRequest (interceptRequestCallback) {
        this.interceptRequestFlag = true
        this.interceptRequestCallback = interceptRequestCallback
    }
    // 响应拦截
    interceptResponse (interceptResponseSuccessCallback, interceptResponseErrorCallback) {
        this.interceptResponseFlag = true
        this.interceptResponseSuccessCallback = interceptResponseSuccessCallback
        this.interceptResponseErrorCallback = interceptResponseErrorCallback
    }
    // get
    get (url, params = {}, config) {
        return this.sendRequest({
            url,
            params: serializeParams(params),
            config
        })
    }
    // post
    post (url, data, config) {
        return this.sendRequest({
            url,
            data: JSON.stringify(data),
            method: 'post',
            config
        })
    }
    // delete
    delete () { }
    // put
    put () { }
}

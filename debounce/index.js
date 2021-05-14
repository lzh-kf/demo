// 防抖
// 效果：如果短时间内大量触发同一事件，只会执行一次函数。
function debounce (callback, waitTime = 300) {
    let timer = null
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            callback.apply(this, args)
        }, waitTime)
    }
}



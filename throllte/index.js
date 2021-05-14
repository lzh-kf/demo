// 节流
// 效果：如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。
function throllte (callback, waitTime = 1000) {
    let flag = false
    return function (...args) {
        if (flag) {
            return
        }
        flag = true
        timer = setTimeout(() => {
            flag = false
            callback.apply(this, args)
        }, waitTime)
    }
}
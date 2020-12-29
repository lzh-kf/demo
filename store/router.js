
const methods = ['switchTab', 'reLaunch', 'redirectTo', 'navigateTo', 'navigateBack']

wx.beforehook = function (options, method) {
    const flag = true
    if (flag) {
        wx[method](options)
    } else {
        console.log('用户无权限')
    }
}
methods.forEach(method => {
    wx[method] = function (options) {
        if (wx.beforehook) {
            wx.beforehook(options, method)
        } else {
            wx.method(options)
        }
    }
})
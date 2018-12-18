function show(message, duration, type) {
  wx.showToast({
    title: message,
    duration: duration,
    icon: type
  })
}
module.exports = show
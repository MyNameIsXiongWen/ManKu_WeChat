// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:提示信息
// success:成功回调
// fail：失败回调

import md5 from './md5.js'
var AppSecret = 'F9A866D686EBADAA3AEDC918422482AD'
var AppKey = '6cbc8c6c825141cf'
const app = getApp()

function ajax(method, url, params, message, success, fail) {
  wx.showLoading({
    title: message,
    mask: true
  })
  var newUrl = seperateURL(url, params)
  var timestamp = Date.parse(new Date());
  var randomStr = timestamp*1000;
  var signature = sortParams(timestamp, randomStr, params)
  var token = wx.getStorageSync('token')
  wx.request({
    url: app.globalData.requestUrl + newUrl,
    data: params,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': AppKey,
      'timestamp': timestamp,
      'noncestr': randomStr,
      'signature': signature,
      'token': token ? token : ''
    },
    success(res) {
      wx.hideLoading()
      if (res.statusCode == 200) {
        if (res.data.code == 2000) {
          success(res.data)
        }
        else {
          wx.showToast({
            title: res.data.msg,
            duration: 1000,
            icon: 'none'
          })
        }
      }
      else if (res.statusCode == 500) {
        wx.showToast({
          title: '服务器内部错误',
          duration:1000,
          icon: 'none'
        })
      }
      else {
        fail()
      }
    },
    fail(res) {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    },
    complete(res) {

    }
  })
}
module.exports = ajax


function seperateURL(url, params) {
  if (url.indexOf('?') == -1) {
    return url
  }
  var paramStr = url.split('?')[1]
  let paramArray = paramStr.split('&')
  paramArray.map((str) => {
    var array = str.split('=')
    if (array.length == 2) {
      params[array[0]] = array[1]
    }
  })
  return url.split('?')[0]
}

function sortParams(time, random, params) {
  var dic = params
  var sortStr = ''
  dic['authorization'] = AppKey
  dic['timestamp'] = time
  dic['noncestr'] = random
  var token = wx.getStorageSync('token')
  if (token) {
    dic['token'] = token
  }
  var keyArray = Object.keys(dic).sort()
  
  for (var key in keyArray) {
    var value = dic[keyArray[key]]
    if (value.length == 0) {
      continue
    }
    sortStr += keyArray[key] + '=' + value + '&'
  }
  if (sortStr.length > 0) {
    sortStr = sortStr.substr(0,sortStr.length-1)
  }
  sortStr += '&key=' + AppSecret
  var md5Str = md5(sortStr).toUpperCase()
  return md5Str
}
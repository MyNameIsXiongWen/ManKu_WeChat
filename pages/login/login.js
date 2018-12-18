const app = getApp()
const ajax = require('../../utils/network.js')
const show = require('../../utils/showToast.js')

Page({
  data: {
    phone: '15651113206',
    code: '999999'
  },
  onLoad: function (options) {
    this.requestGetCode()
  },
  inputPhone(e) {
    this.data.phone = e.detail.value;
  },
  inputCode(e) {
    this.data.code = e.detail.value;
  },
  clickLogin() {
    if (this.data.phone.length == 0) {
      show('请输入手机号', 1500, 'none');
      return
    }
    else if (this.data.phone.length < 11) {
      show('请输入完整手机号', 1500, 'none');
      return
    }
    if (this.data.code.length == 0) {
      show('请输入验证码', 1500, 'none');
      return
    }
    else if (this.data.code.length < 6) {
      show('验证码错误', 1500, 'none');
      return
    }
    this.requestLogin()
  },
  requestGetCode() {
    ajax('POST', 'api-base/captcha/sms', { 'phoneNumber': this.data.phone, 'captchaType': '2'}, '', function() {

    }, function () {

    })
  },
  requestLogin() {
    var params = {'username': this.data.phone, 'password': this.data.code, 'type': '01'};
    ajax('POST', 'api-base/user/login', params, '', function(res) {
      wx.showToast({
        title: '登录成功'
      })
      wx.setStorageSync('token', res.data.token)
      wx.navigateBack({
        
      })
    }, function(res) {

    })
  }
})
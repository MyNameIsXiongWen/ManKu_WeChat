const app = getApp()
const ajax = require('../../../utils/network.js')

Page({
  data: {
    globalData: app.globalData,
    userInfo:{},
    // 数组不会越界，所以dataList[1]不会出错，是undefined 不显示
    dataList: [['头像'], ['昵称'], ['性别'], ['手机号'], ['自我介绍'], ['修改登录密码'], ['设置支付密码']]
  },
  onLoad: function (options) {
    var info = JSON.parse(options.userInfo);
    var sex = '保密';
    if (info.sex == '0') {
      sex = '女'
    }
    else if (info.sex == '1') {
      sex = '男'
    }
    var phone = info.phoneNumber.substring(0, 3) + '****' + info.phoneNumber.substring(7,11);
    var introduce = info.introduce.length > 0 ? info.introduce : '暂无介绍'
    this.setData({
      userInfo: info,
      dataList: [['头像'], ['昵称', info.nickName], ['性别', sex], ['手机号', phone], ['自我介绍', introduce], ['修改登录密码'], ['设置支付密码']]
    })
  },
  clickCell(e) {
    
  },
  clickLogout() {
    wx.removeStorageSync('token')
    wx.navigateBack()
  }
})
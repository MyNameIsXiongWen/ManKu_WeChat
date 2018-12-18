const app = getApp()
const ajax = require('../../utils/network.js')

Page({
  data: {
    token: wx.getStorageSync('token'),
    dataInfo: app.globalData,
    privilege: '../../images/privilege.png',
    userInfo: {},
    orderList: [
      { 'name': '待付款', 'img': '../../images/order_pay.png' },
      { 'name': '待发货', 'img': '../../images/order_send.png' }, 
      { 'name': '待收货', 'img': '../../images/order_receive.png' },
      { 'name': '退款/售后', 'img': '../../images/order_refund.png' },
      { 'name': '全部订单', 'img': '../../images/order_all.png' }
    ],
    orderStatusNumList: [0, 0, 0, 0, 0],
    btnList: [
      { 'name': '我的收藏', 'img': '../../images/mine_mycollection.png' },
      { 'name': '收货地址', 'img': '../../images/mine_address.png' },
      { 'name': '我的足迹', 'img': '../../images/mine_mytrack.png' },
      { 'name': '意见反馈', 'img': '../../images/mine_feedback.png' },
      { 'name': '常见问题', 'img': '../../images/mine_question.png' },
      { 'name': '我的顾问', 'img': '../../images/mine_mycounselor.png' },
      { 'name': '关于我们', 'img': '../../images/mine_aboutus.png' }
    ]
  },
  onLoad: function () {
    
  },
  onShow() {
    this.setData({
      token: wx.getStorageSync('token')
    })
    if (this.data.token) {
      this.requestUserInfo()
      this.requestOrderStatus()
    }
    else {
      this.setData({
        userInfo: { 'nickName': '', 'profilePhotoImgSrc': '../../images/avatar.png', 'accountBalance': 0, 'cashCouponCount': 0, 'redEnvelopesCount': 0 }
      })
    }
  },
  requestUserInfo() {
    ajax('GET', 'api-base/user/center', {}, '加载个人信息', res => {
      wx.showToast({
        title: '加载成功'
      })
      res.data['profilePhotoImgSrc'] = this.data.dataInfo.ossUrl + res.data.profilePhotoImgSrc;
      res.data['defaultHouseType'] = res.data.defaultHouseType.length > 0 ? res.data.defaultHouseType : '无';
      res.data['schemeUpdateTime'] = res.data.schemeUpdateTime ? res.data.schemeUpdateTime : '无方案';
      this.setData({
        userInfo: res.data,
      })
    }, function() {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },
  requestOrderStatus() {
    ajax('GET', 'api-order/order/groupByStatus', {}, '', res => {
      var payNum = 0;
      var sendNum = 0;
      var receiveNum = 0;
      var refundNum = 0;
      var allNum = 0;
      res.data.map((dic)=> {
        switch(dic.orderStatus) {
          case '01':
            payNum = dic.orderCount;
          break;
          case '02':
            sendNum = dic.orderCount;
            break;
          case '03':
            receiveNum = dic.orderCount;
            break;
          case '05':
            refundNum = dic.orderCount;
            break;
          case '12':
            allNum = dic.orderCount;
            break;
        }
      })
      this.setData({
        orderStatusNumList: [payNum, sendNum, receiveNum, refundNum, allNum]
      })
    }, function() {

    })
  },
  clickLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  clickAvatar() {
    this.setData({
      token: wx.getStorageSync('token')
    })
    if (this.data.token) {
      wx.navigateTo({
        url: 'userInfo/userInfo?userInfo=' + JSON.stringify(this.data.userInfo)
      })
    }
    else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  clickSetting() {
    
  },
  clickOrder(e) {
    console.log(e.currentTarget.dataset.tag)
  },
  clickMyHousetype() {

  },
  clickMyScheme() {

  },
  clickBtn(e) {
    console.log(e.currentTarget.dataset.tag)
  }
})

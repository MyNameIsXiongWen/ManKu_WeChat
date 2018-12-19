const app = getApp()
const ajax = require('../../utils/network.js')
const getTime = require('../../utils/getTime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: app.globalData,
    address: '杭州',
    showAddress: false,
    showActivity: false,
    activityDic: {'coverImgSrc': '../../images/placeholdimage.png'},
    swiperlist: [],
    entranceList: [
      { 'chinese': '关联户型', 'english': 'RELATED FAMILY UNIT', 'img': '', 'color': '#eaa471'},
      { 'chinese': '我的收藏', 'english': 'MY COLLECTED', 'img': '', 'color': '#ed9090'},
      { 'chinese': '我的方案', 'english': 'THAT`S MY PLAN', 'img': '', 'color': '#92acd0' },
      { 'chinese': '智能设计', 'english': 'INTELLIGENT DESIGN', 'img': '', 'color': '#fbd481' }
    ],
    pageNum: 1,
    seckillList:[],
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestActivity()
  },
  onShow() {
    this.requestSlideShow()
    this.requestGoodsList()
    this.requestSeckill()
  },
  onHide() {
    this.setData({
      showAddress: false
    })
  },
  onPullDownRefresh() {
    console.log('ddddd')
    this.data.pageNum = 1
    this.requestGoodsList()
  },
  onReachBottom() {
    this.data.pageNum += 1
    this.requestGoodsList()
  },
  //点击选择城市
  clickAddress() {
    this.setData({
      showAddress: !this.data.showAddress
    })
  },
  //点击搜索
  clickSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //点击扫码
  clickScan() {
    wx.scanCode({
      onlyFromCamera: false,
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //banner滑动
  swiperChange() {

  },
  //点击banner
  clickSwiper(event) {
    console.log(event.currentTarget.dataset.index)
  },
  //点击4个入口
  clickEntrance(event) {
    console.log(this.data.entranceList[event.currentTarget.dataset.index])
  },
  //点击弹窗取消按钮
  clickCancel() {
    this.setData({
      showActivity: false
    })
    console.log(this.data.showActivity)
  },
  //点击弹窗内容
  clickActivityContent(e) {
    this.setData({
      showActivity: false
    })
    console.log(e.currentTarget.dataset.dic)
  },
  //请求banner页
  requestSlideShow() {
    var that = this
    ajax('GET', 'api-base/slideshow', { 'categoryCode': '04' }, 'loading', function (res) {
      wx.showToast({
        title: '加载成功'
      })
      that.setData({
        swiperlist: res.data
      })
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },
  //请求活动弹窗
  requestActivity() {
    ajax('GET', 'api-base/hot-remind/active', { 'clientType': '02' }, '', (res) => {
      // res.data['coverImgSrc'] = this.data.dataInfo.ossUrl + res.data.coverImgSrc;       
      // res.data['coverImgSrc'] = '../../images/placeholdimage.png';
      this.setData({
        activityDic: res.data,
        showActivity: true
      })
    }, () => {

    })
  },
  //请求商品列表
  requestGoodsList() {
    var that = this
    ajax('GET', 'api-search/item', { 'pageNum': this.data.pageNum, 'pageSize': '10' }, 'loading', function (res) {
      if (that.data.goodsList.length == 0) {
        wx.showToast({
          title: '加载成功'
        })
      }
      that.setData({
        goodsList: that.data.pageNum == 1 ? res.data.data : that.data.goodsList.concat(res.data.data)
      })
      wx.stopPullDownRefresh()
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },
  // 请求抢购列表
  requestSeckill() {
    ajax('GET', 'api-item/seckill', { 'pageNum': '1', 'pageSize': '5' }, '', (res)=> {
      setInterval(()=> {
        res.data.data.map((dic) => {
          dic['gmtCurrent'] = getTime.timeFormatter(dic.gmtCurrent)
          var results = getTime.getTime(dic.gmtCurrent, dic.gmtEnd)
          dic['results'] = results
          this.setData({
            seckillList: res.data.data
          })
        })
      },1000)
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  }
})
// pages/goods/goodsList/goodsList.js
const app = getApp()
const ajax = require('../../utils/network.js')
Page({
  data: {
    globalData: app.globalData,
    firstCategory:['系列', '品类', '风格', '🔍'],
    secondCategory:[],
    currentFirstTag: 0,
    currentSecondTag: 0,
    goodsList: [],
    pageNum: 1,
    firstCategoryCode: '01',
    secondCategoryCode: ''
  },
  onLoad: function (options) {
    this.requestSecondCategory()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {
    this.data.pageNum = 1
    this.requestGoodsList()
  },
  onReachBottom: function () {
    this.data.pageNum += 1
    this.requestGoodsList()
  },
  onShareAppMessage: function () {

  },
  clickFirstCategory(e) {
    var code = ''
    if (e.currentTarget.dataset.tag == 0) {
      code = '01'
    }
    else if (e.currentTarget.dataset.tag === 1) {
      code = '03'
    }
    else if (e.currentTarget.dataset.tag === 2) {
      code = '02'
    }
    this.setData({
      currentFirstTag: e.currentTarget.dataset.tag,
      firstCategoryCode: code
    })
    this.requestSecondCategory()
  },
  clickSecondCategory(e) {
    var model = this.data.secondCategory[e.currentTarget.dataset.tag];
    if (model.spaceCode != this.data.secondCategoryCode) {
      this.setData({
        currentSecondTag: e.currentTarget.dataset.tag,
        secondCategoryCode: model.spaceCode
      })
      this.requestGoodsList()
    }
  },
  //请求二级类目
  requestSecondCategory() {
    ajax('GET', 'api-base/search-condition', { 'typeCode': this.data.firstCategoryCode }, '', (res)=> {
      if (res.data.length > 0) {
        this.setData({
          secondCategory: res.data,
          secondCategoryCode: res.data[0].spaceCode
        })
        this.requestGoodsList()
      }
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },
  //请求商品列表
  requestGoodsList() {
    var params = { 'pageNum': this.data.pageNum, 'pageSize': '20' };
    if (this.data.firstCategoryCode === '01') {
      params.seriesCode = this.data.secondCategoryCode
    }
    else if (this.data.firstCategoryCode === '02') {
      params.styleCode = this.data.secondCategoryCode
    }
    else if (this.data.firstCategoryCode === '03') {
      params.itemCategoryIds = this.data.secondCategoryCode
    }
    ajax('GET', 'api-search/item', params, '', (res)=> {
      if (this.data.goodsList.length == 0) {
        wx.showToast({
          title: '加载成功'
        })
      }
      this.setData({
        goodsList: this.data.pageNum == 1 ? res.data.data : this.data.goodsList.concat(res.data.data)
      })
      wx.stopPullDownRefresh()
    }, function (res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  }
})
const app = getApp()
const ajax = require('../../../utils/network.js')

Page({
  data: {
    goodsId: '',
    globalData: app.globalData,
    navData: ['商品', '详情', '推荐'],
    goodsDetail: {},
    buyNum: 1,
    discount: [],
    goodsInfoList: [],
    imagesList: []
  },
  onLoad: function (options) {
    this.data.goodsId = options.goodsId
    this.requestGoodsDetail()
  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  },
  requestGoodsDetail() {
    ajax('GET', 'api-item/item/' + this.data.goodsId, {}, '', (res)=> {
      this.analysicsData(res)
    }, ()=> {

    })
  },
  analysicsData(res) {
    var disc = {};
    if (res.data.privilegeCardFlag) {
      disc = [ '特权折扣', '购买此商品时，享' + parseFloat(res.data.privilegeCardDiscountValue) / 10 + '折优惠，不可与全场活动同时使用']
    }
    else {
      disc = ['全场' + parseFloat(res.data.discountValue) * 10 + '折', '购买此商品时，享' + parseFloat(res.data.discountValue) * 10 + '折优惠，不可与特权卡折扣同时使用']
    }
    var list = []
    var sss = res.data.defaultItemSku.presell ? '现货商品' : '预售商品'
    list.push('型号：' + res.data.defaultItemSku.itemSkuCode);
    list.push('运费：免运费');
    list.push('发货时间：' + sss + ' ' + res.data.defaultItemSku.deliverDescription);
    list.push('配送限制：' + res.data.deliveryDescription)
    this.htmlStringToImages(res.data.detail)
    this.setData({
      goodsDetail: res.data,
      discount: disc,
      goodsInfoList: list
    })
  },
  htmlStringToImages(html) {
    var list = []
    var htmlJson = JSON.parse(html);
    htmlJson.map((dic)=> {
      var nopStr = dic.content.replace('<p>', '')
      nopStr = nopStr.replace('</p>', '')
      var imgaaa = nopStr.split('">')
      imgaaa.pop()
      imgaaa.map((str)=> {
        str = str.replace('>', '')
        str = str.replace('<img src="', '');
        list.push(str)
      })
    })
    this.setData({
      imagesList: list
    })
  }
})
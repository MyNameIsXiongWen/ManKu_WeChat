const app = getApp()
const ajax = require('../../../utils/network.js')

Page({
  data: {
    goodsId: '',
    globalData: app.globalData,
    navData: ['商品', '详情', '推荐'],
    currentIndex: 0,
    goodsDetail: {},
    buyNum: 1,
    discount: [],
    goodsInfoList: [],
    imagesList: [],
    toView: '',
    hideShadowView: true,
    animationDataSpec: '',//sku的动画
    animationDataDiscount: '',//活动的动画
    detailType: 0,  //详情类型 0:商品 1:抢购 2:拼团
    buyBtnTitle: '立即购买',
    cartBtnTitle: '加入购物车',
  },
  onLoad: function (options) {
    this.data.goodsId = options.goodsId
    this.setData({
      detailType: options.detailType
    })
    if (this.data.detailType == 0) {
      this.requestGoodsDetail()
    }
    else if (this.data.detailType == 1) {
      this.requestSeckillDetail()
    }
    else if (this.data.detailType == 2) {
      this.requestGroupBuyDetail()
    }
  },
  onShow: function () {
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {

    }
    return {
      title: this.data.goodsDetail.name,
      path: '/pages/goods/goodsDetail/goodsDetails',
      success: (res)=> {
        
      }
    }
  },
  shareMessage() {
    wx.onShareAppMessage()
  },
  scrollFunc(e) {
    // 有问题
    var scrollH = e.detail.scrollHeight;
    var screenH = 667-64-40-50;
    var top = e.detail.scrollTop
    var h1 = 0, h2 = 0, h3 = 0;
    wx.createSelectorQuery().select('#goods').boundingClientRect((rect) => {
      h1 = rect.height
      if (screenH < e.detail.scrollTop) {
        this.setData({
          currentIndex: 0
        })
      }
    }).exec()
    wx.createSelectorQuery().select('#detail').boundingClientRect((rect) => {
      h2 = rect.height
      if (h1 - screenH < e.detail.scrollTop) {
        if (e.detail.scrollTop <= 0) {
          this.setData({
            currentIndex: 0
          })
          return
        }
        this.setData({
          currentIndex: 1
        })
      }
    }).exec()
    wx.createSelectorQuery().select('#recommend').boundingClientRect((rect) => {
      h3 = rect.height
      if (scrollH - screenH - h3 < e.detail.scrollTop) {
        this.setData({
          currentIndex: 2
        })
      }
    }).exec()
  },
  clickNav(e) {
    var tview = ''
    if (e.currentTarget.dataset.tag == 0) {
      tview = 'goods'
    }
    else if (e.currentTarget.dataset.tag == 1) {
      tview = 'detail'
    }
    else if (e.currentTarget.dataset.tag == 2) {
      tview = 'recommend'
    }
    this.setData({
      toView: tview,
      currentIndex: e.currentTarget.dataset.tag
    })
  },
  clickSpecView() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    if (this.data.hideShadowView) {
      animation.translateY(-500 * this.data.globalData.screenWidth / 375).opacity(1).step()
    }
    else {
      animation.translateY(500 * this.data.globalData.screenWidth / 375).opacity(0).step()
    }
    this.setData({
      hideShadowView: !this.data.hideShadowView,
      animationDataSpec: animation.export()
    })
  },
  clickDiscountView() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    if (this.data.hideShadowView) {
      animation.translateY(-200 * this.data.globalData.screenWidth / 375).opacity(1).step()
    }
    else {
      animation.translateY(200 * this.data.globalData.screenWidth / 375).opacity(0).step()
    }
    var that = this
    this.setData({
      hideShadowView: !that.data.hideShadowView,
      animationDataDiscount: animation.export()
    })
  },
  clickSpecSku(e) {
    let indexPath = e.currentTarget.dataset.indexpath;
    var itemSkuAttrIds = this.data.goodsDetail.defaultItemSku.itemSkuAttrIds;
    var itemSkuAttrsModel = this.data.goodsDetail.itemSkuAttrs[indexPath[0]];
    var childredModel = itemSkuAttrsModel.children[indexPath[1]];
    if (childredModel.id != itemSkuAttrIds.split(',')[indexPath[0]]) {
      var skuAttrsId = itemSkuAttrIds;
      var idsArr = skuAttrsId.split(',');
      idsArr.splice(indexPath[0], 1, childredModel.id);
      var newSkuAttrsId = idsArr.join(',');

      var allSkuAttrsIdArray = [];
      this.data.goodsDetail.itemSkus.map((model)=> {
        allSkuAttrsIdArray.push(model.itemSkuAttrIds)
      })
      if (allSkuAttrsIdArray.indexOf(newSkuAttrsId) != -1) {
        this.data.goodsDetail.itemSkus.map((model) => {
          if (model.itemSkuAttrIds == newSkuAttrsId) {
            model.defaultSku = true;
            this.data.goodsDetail.defaultItemSku = model;
            this.data.goodsDetail.defaultItemSku.skuAttrIdArray = this.data.goodsDetail.defaultItemSku.itemSkuAttrIds.split(',')
            this.setData({
              goodsDetail: this.data.goodsDetail
            })
          }
          else {
            model.defaultSku = false;
          }
        })
      }
    }
  },
  minusGoodsCount() {
    if (this.data.goodsDetail.defaultItemSku.buyNum > 1) {
      this.data.goodsDetail.defaultItemSku.buyNum--;
      this.setData({
        goodsDetail: this.data.goodsDetail
      })
    }
  },
  plusGoodsCount() {
    this.data.goodsDetail.defaultItemSku.buyNum++;
    this.setData({
      goodsDetail: this.data.goodsDetail
    })
  },
  inputBuyNum(e) {
    this.data.goodsDetail.defaultItemSku.buyNum = e.detail.value;
    this.setData({
      goodsDetail: this.data.goodsDetail
    })
  },
  clickBuy() {
    if (this.data.animationDataSpec) {
      if (this.data.detailType == 0) {
        this.goodsBuyNowRequest(this.data.goodsDetail.defaultItemSku.id, this.data.goodsDetail.defaultItemSku.buyNum)
      }
      else if (this.data.detailType == 1) {
        
      }
      else if (this.data.detailType == 2) {
        
      }
    }
    else {
      this.clickSpecView()
    }
  },
  clickShoppingCart() {
    if (this.data.animationDataSpec) {
      if (this.data.detailType == 0) {
        this.goodsAddShoppingCartRequest(this.data.goodsDetail.defaultItemSku.id, this.data.goodsDetail.defaultItemSku.buyNum)
      }
      else if (this.data.detailType == 1) {
        
      }
      else if (this.data.detailType == 2) {
        
      }
    }
    else {
      this.clickSpecView()
    }
  },
  // 点击蒙层
  clickShadow() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    if (this.data.animationDataSpec) {
      animation.translateY(500 * this.data.globalData.screenWidth / 375).opacity(0).step()
      var that = this
      that.setData({
        hideShadowView: true,
        animationDataSpec: animation.export()
      })
      this.data.animationDataSpec = ''
    }
    else {
      animation.translateY((this.data.discount.length * 80 + 140) * this.data.globalData.screenWidth / 375).opacity(0).step()
      var that = this
      that.setData({
        hideShadowView: true,
        animationDataDiscount: animation.export()
      })
      this.data.animationDataDiscount = ''
    }
  },
  requestGoodsDetail() {
    ajax('GET', 'api-item/item/' + this.data.goodsId, {}, '', (res) => {
      this.analysicsData(res.data)
    }, () => {

    })
  },
  requestSeckillDetail() {
    ajax('GET', 'api-item/seckill/' + this.data.goodsId, {}, '', (res) => {
      res.data.item.favorite = res.data.favorite; 
      this.analysicsData(res.data.item)
    }, () => {

    })
  },
  requestGroupBuyDetail() {
    ajax('GET', 'api-item/group-buy/' + this.data.goodsId, {}, '', (res) => {
      res.data.item.favorite = res.data.favorite;
      this.analysicsData(res.data.item)
    }, () => {

    })
  },
  analysicsData(res) {
    var arr = [];
    if (res.privilegeCardFlag) {
      arr.push(['特权折扣', '购买此商品时，享' + parseFloat(res.privilegeCardDiscountValue) / 10 + '折优惠，不可与全场活动同时使用'])
    }
    if (res.discountValue > 0) {
      arr.push(['全场' + parseFloat(res.discountValue) * 10 + '折', '购买此商品时，享' + parseFloat(res.discountValue) * 10 + '折优惠，不可与特权卡折扣同时使用'])
    }
    var list = []
    var sss = res.defaultItemSku.presell ? '现货商品' : '预售商品'
    list.push('型号：' + res.defaultItemSku.itemSkuCode);
    list.push('运费：免运费');
    list.push('发货时间：' + sss + ' ' + res.defaultItemSku.deliverDescription);
    list.push('配送限制：' + res.deliveryDescription)
    this.htmlStringToImages(res.detail)
    res.itemSkus.map((model) => {
      model.buyNum = 1;
      if (model.itemSkuAttrIds == res.defaultItemSku.itemSkuAttrIds) {
        //把默认sku和数组里的对等起来，这样第一次修改默认sku，数组内数据也会变
        res.defaultItemSku = model;
        res.defaultItemSku.skuAttrIdArray = res.defaultItemSku.itemSkuAttrIds.split(',')
      }
    })
    var str1 = '立即购买', str2 = '加入购物车';
    if (this.data.detailType == 2) {
      str1 = '¥ ' + res.defaultItemSku.originalPrice + '\n单独购买';
      str2 = '¥ ' + res.defaultItemSku.groupBuyPrice + '\n发起拼团';
    }
    // res.ineffective = true;
    this.setData({
      goodsDetail: res,
      discount: arr,
      goodsInfoList: list,
      buyBtnTitle: str1,
      cartBtnTitle: str2
    })
  },
  htmlStringToImages(html) {
    var list = []
    var htmlJson = JSON.parse(html);
    htmlJson.map((dic) => {
      var nopStr = dic.content.replace('<p>', '')
      nopStr = nopStr.replace('</p>', '')
      var imgaaa = nopStr.split('">')
      imgaaa.pop()
      imgaaa.map((str) => {
        str = str.replace('>', '')
        str = str.replace('<img src="', '');
        list.push(str)
      })
    })
    this.setData({
      imagesList: list
    })
  },
  // 立即购买
  goodsBuyNowRequest(skuid, number) {
    ajax('POST', 'api-cart/confirm/item/buy-now', { activityType: 2, itemSkuId: skuid, itemNum: number, type: '01'}, '', (res) => {
      wx.navigateTo({
        url: '../../order/confirmOrder/confirmOrder?shareId=' + res.data.shareId,
      })
    }, () => {

    })
  },
  // 加入购物车
  goodsAddShoppingCartRequest(skuid, number) {
    ajax('POST', 'api-cart/item-cart', { itemSkuId: skuid, itemNum: number }, '', (res) => {
      wx.showToast({
        title: '加入购物车成功',
      })
      this.clickShadow()
    }, () => {

    })
  }
})
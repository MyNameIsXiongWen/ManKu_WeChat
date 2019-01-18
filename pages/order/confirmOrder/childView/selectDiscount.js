// pages/order/confirmOrder/childView/selectDiscount.js
Page({
  data: {
    discountArray: []
  },
  onLoad: function (options) {
    this.data.discountArray = JSON.parse(options.discountInfo)
    this.data.discountArray.map(dic => {
      var goodsNameList = []
      dic.list.map(category => {
        goodsNameList.push(category.categoryName)
      })
      var goodsString = goodsNameList.join('、')
      var descString = ''
      if (dic.discountName) {
        if (dic.limitCategoryFlag == 1) {
          descString = '全场商品享' + dic.discountValue*10 + '折优惠'
        }
        else if (dic.limitCategoryFlag == 2) {
          descString = goodsString + '商品在全场活动范围内'
        }
        else if (dic.limitCategoryFlag == 3) {
          descString = goodsString + '商品不在全场活动范围内'
        }
      }
      else {
        if (dic.limitCategoryFlag == 1) {
          descString = '全场商品享' + dic.productDiscount / 10 + '折优惠'
        }
        else if (dic.limitCategoryFlag == 2) {
          descString = dic.limitCategoryName + '商品在全场活动范围内'
        }
        else if (dic.limitCategoryFlag == 3) {
          descString = dic.limitCategoryName + '商品不在全场活动范围内'
        }
      }
      dic['desc'] = descString
    })
    this.setData({
      discountArray: this.data.discountArray
    })
  },
  onShow: function () {

  },
  selectDiscount (evt) {
    var discount = evt.currentTarget.dataset.info
    var pages = getCurrentPages()
    var prevPage = pages[pages.length-2]
    if (discount.discountName) {
      prevPage.setData({
        discountInfo: [discount.discountName, discount.discountValue]
      })
    }
    else {
      prevPage.setData({
        discountInfo: [discount.privilegeCardName, discount.lowsetDiscount]
      })
    }
    prevPage.calculateDiscountMoney()
    wx.navigateBack({
      delta: 1
    })
  }
})
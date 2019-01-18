const app = getApp()
const ajax = require('../../../utils/network.js')

Page({
  data: {
    globalData: app.globalData,
    shareId: '',
    addressModel: null,
    orderModel: null,
    imageArray: [],
    detailType: 0, //详情类型 0:商品 1:抢购 2:拼团 3:拼团商品单独购买
    orderType: 0, //0成品订单   1定制订单  2 配套订单  4 代金券订单
    discountInfo: ['', ''], //当前所选折扣（全场折扣或特权卡折扣）[名字，折扣]
    discountArray: [], // 所有可选活动数组
    totalMoney: 0, // 商品总额
    shouldPayMoney: 0 // 应付总额
  },
  onLoad: function (options) {
    this.data.shareId = options.shareId
    console.log(this.data.shareId)
    this.getOrderDetailRequest()
    this.getAddressRequest()
  },
  onShow: function () {
    
  },
  onShareAppMessage: function () {

  },
  getAddressRequest () {
    ajax('GET', 'api-order/address', {}, '', (res) => {
      res.data.map(model => {
        if (model.defaultAddress === true) {
          this.setData({
            addressModel: model
          })
          console.log(model)
          return
        }
      })
    }, ()=> {

    })
  },
  getOrderDetailRequest () {
    let url = 'api-cart/share/share?id=' + this.data.shareId
    ajax('GET', url, {}, '', (res) => {
      console.log(res)
      this.setData({
        orderModel:res.data
      })
      this.getGoodsImageSrcArray(res.data)
      this.configDiscountInfo(res.data)
      this.calculateDiscountMoney()
    }, () => {

    })
  },
  // 获取所有商品图片数组
  getGoodsImageSrcArray (data) {
    data.itemCarts.map((itemCart) => {
      this.data.imageArray.push(itemCart.imgSrc)
      this.data.totalMoney += itemCart.currentPrice * itemCart.itemNum
    })
    data.schemeCarts.map(schemeCart => {
      schemeCart.children.map(children => {
        children.itemCarts.map(itemCart => {
          this.data.imageArray.push(itemCart.imgSrc)
          this.data.totalMoney += itemCart.currentPrice * itemCart.itemNum
        })
      })
    })
    this.setData({
      imageArray: this.data.imageArray,
      totalMoney: this.data.totalMoney
    })
  },
  // 配置折扣后的商品价格
  configGoodsPrice () {
    var goodsDic = {}
    this.data.orderModel.categoryAndPriceBOS.map(model => {
      var price = model.thisCategoryPrice - model.thisHotCategoryPrice
      goodsDic[model.itemCategoryId] = price
      // 如果选用特权卡
      if (this.data.orderModel.userPrivilegeCardBO) {
        if (this.data.discountInfo[0] === this.data.orderModel.userPrivilegeCardBO.privilegeCardName) {
          // 特权卡可用额度
          var usableMoney = this.data.orderModel.userPrivilegeCardBO.money - this.data.orderModel.userPrivilegeCardBO.occupyMoney
          var totalPrice = 0
          // 全部可用
          if (this.data.orderModel.userPrivilegeCardBO.limitCategoryFlag == 1) {
            this.data.orderModel.categoryAndPriceBOS.map(model2 => {
              totalPrice += model2.thisCategoryPrice - model2.thisHotCategoryPrice
            })
            if (usableMoney >= totalPrice) {
              // 折后商品价格
              price = price * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100
            }
            else {
              var rate = usableMoney / totalPrice
              // 按可用额度比例部分打折，剩下的还是原价
              price = price * rate * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100 + price * (1 - rate)
            }
            goodsDic[model.itemCategoryId] = price
          }
          // 部分可用
          else if (this.data.orderModel.userPrivilegeCardBO.limitCategoryFlag == 2) {
            var limitList = this.data.orderModel.userPrivilegeCardBO.limitCategory.join(',')
            this.data.orderModel.categoryAndPriceBOS.map(model2 => {
              limitList.map(obj => {
                if (obj === model2.itemCategoryId) {
                  // 计算所有的可用商品总价
                  totalPrice += model2.thisCategoryPrice - model2.thisHotCategoryPrice
                }
              })
            })
            limitList.map(obj => {
              if (obj === model.itemCategoryId) {
                if (usableMoney >= totalPrice) {
                  // 折后商品价格
                  price = price * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100
                }
                else {
                  var rate = usableMoney / totalPrice
                  // 按可用额度比例部分打折，剩下的还是原价
                  price = price * rate * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100 + price * (1 - rate)
                }
                goodsDic[model.itemCategoryId] = price
              }
            })
          }
          // 部分不可用
          else if (this.data.orderModel.userPrivilegeCardBO.limitCategoryFlag == 3) {
            var limitList = this.data.orderModel.userPrivilegeCardBO.limitCategory.join(',')
            this.data.orderModel.categoryAndPriceBOS.map(model2 => {
              var limit = false
              limitList.map(obj => {
                if (obj === model2.itemCategoryId) {
                  limit = true
                }
              })
              if (!limit) {
                // 计算不被限制的所有商品总价
                totalPrice += model2.thisCategoryPrice - model2.thisHotCategoryPrice
              }
            })
            // 判断当前这个商品是否被限制不可用
            var limit = false
            limitList.map(obj => {
              if (obj === model.itemCategoryId) {
                limit = true
              }
            })
            if (!limit) {
              if (usableMoney >= totalPrice) {
                // 折后商品价格
                price = price * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100
              }
              else {
                var rate = usableMoney / totalPrice
                // 按可用额度比例部分打折，剩下的还是原价
                price = price * rate * this.data.orderModel.userPrivilegeCardBO.productDiscount / 100 + price * (1 - rate)
              }
              goodsDic[model.itemCategoryId] = price
            }
          }
        }
      }
      else if (this.data.orderModel.discountDTOS) {
        if (this.data.discountInfo[0] === this.data.orderModel.discountDTOS.discountName) {
          // 通用
          if (this.data.orderModel.discountDTOS.limitCategoryFlag === 1) {
            price = price * this.data.orderModel.discountDTOS.discountValue
            goodsDic[model.itemCategoryId] = price
          }
          // 部分可用
          else if (this.data.orderModel.discountDTOS.limitCategoryFlag === 2) {
            var limit = false
            this.data.orderModel.discountDTOS.list.map(obj => {
              if (obj.categoryId === model.itemCategoryId) {
                limit = true
              }
            })
            if (limit) {
              price = price * this.data.orderModel.discountDTOS.discountValue
              goodsDic[model.itemCategoryId] = price
            }
          }
          // 部分不可用
          else if (this.data.orderModel.discountDTOS.limitCategoryFlag === 3) {
            var limit = true
            this.data.orderModel.discountDTOS.list.map(obj => {
              if (obj.categoryId === model.itemCategoryId) {
                limit = false
              }
            })
            if (limit) {
              price = price * this.data.orderModel.discountDTOS.discountValue
              goodsDic[model.itemCategoryId] = price
            }
          }
        }
      }
    })
    this.data.orderModel.categoryAndPriceBOS.map(model => {
      goodsDic[model.itemCategoryId] = goodsDic[model.itemCategoryId] + model.thisHotCategoryPrice
    })
    return goodsDic
  },
  // 配置折扣信息
  configDiscountInfo (data) {
    var value1 = 1
    var value2 = 1
    if (data.discountDTOS) {
      value1 = data.discountDTOS.discountValue
      this.data.discountArray.push(data.discountDTOS)
    }
    if (data.userPrivilegeCardBO) {
      value2 = data.userPrivilegeCardBO.lowsetDiscount
      this.data.discountArray.push(data.userPrivilegeCardBO)
    }
    if (value1 < value2) {
      this.setData({
        discountInfo: [data.discountDTOS.discountName, value1]
      })
    }
    else {
      this.setData({
        discountInfo: [data.userPrivilegeCardBO.privilegeCardName, value2]
      })
    }
  },
  // 计算折后商品总额
  calculateDiscountMoney () {
    if (this.data.discountInfo[0].length > 0) {
      this.data.shouldPayMoney = 0
      var newCategoryAndPriceBos = this.configGoodsPrice()
      for (var key in newCategoryAndPriceBos) {
        this.data.shouldPayMoney += newCategoryAndPriceBos[key]
      }
      this.setData({
        shouldPayMoney: this.data.shouldPayMoney
      })
    }
  },
  // 选择活动
  selectDiscount () {
    wx.navigateTo({
      url: './childView/selectDiscount?discountInfo=' + JSON.stringify(this.data.discountArray),
    })
  },
  // 提交订单
  sumbitOrder () {

  }
})
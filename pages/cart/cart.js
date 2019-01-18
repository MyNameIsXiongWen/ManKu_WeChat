// pages/cart/cart.js
const app = getApp()
import ajax from '../../utils/network.js'
Page({

  data: {
    globalData: app.globalData,
    currentIndex: 0,
    allShoppingCart: {},
    shoppingCart: {},
    firstItemCarts: {}
  },
  onLoad: function (options) {
    this.getCartRequest()
    console.log(this.data.globalData)
  },
  onShow: function () {

  },
  clickNav (evt) {
    var index = evt.currentTarget.dataset.index
    var obj = {}
    if (index == 0) {
      obj = this.allShoppingCart.finishedItemCart
    }
    else if (index == 1) {
      obj = this.allShoppingCart.customItemCart
    }
    else if (index == 2) {
      obj = this.allShoppingCart.suiteItemCart
    }
    this.setData({
      currentIndex: index,
      shoppingCart: obj
    })
  },
  getCartRequest () {
    ajax('GET', 'api-cart/cart', {}, '', res => {
      console.log(res.data)
      res.data.finishedItemCart.schemeCarts.map(scheme => {
        scheme['schemeCartShow'] = true
        scheme['schemeCartSelected'] = true
        scheme.children.map(room => {
          room['itemCartShow'] = true
          room['itemCartSelected'] = true
        })
      })
      this.setData({
        allShoppingCart: res.data,
        shoppingCart: res.data.finishedItemCart,
        firstItemCarts: { roomName: '满屋自营', itemCarts: res.data.finishedItemCart.itemCarts, itemCartSelected: true, itemCartShow: true}
      })
      console.log(this.data.firstItemCarts)
    }, () => {

    })
  }
})
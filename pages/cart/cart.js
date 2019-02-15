// pages/cart/cart.js
const app = getApp()
import ajax from '../../utils/network.js'
Page({

  data: {
    globalData: app.globalData,
    currentIndex: 0,
    allShoppingCart: {},
    shoppingCart: {},
    firstItemCarts: {},
    editing: false,
    allSelected: true
  },
  onLoad: function (options) {
    this.getCartRequest()
    console.log(this.data.globalData)
  },
  onShow: function () {

  },
  // 点击顶部导航栏
  clickNav (evt) {
    var index = evt.currentTarget.dataset.index
    var obj = {}
    if (index == 0) {
      obj = this.data.allShoppingCart.finishedItemCart
    }
    else if (index == 1) {
      obj = this.data.allShoppingCart.customItemCart
    }
    else if (index == 2) {
      obj = this.data.allShoppingCart.suiteItemCart
    }
    this.data.firstItemCarts.itemCarts = obj.itemCarts
    this.setData({
      currentIndex: index,
      shoppingCart: obj,
      firstItemCarts: this.data.firstItemCarts
    })
  },
  // 获取购物车数据
  getCartRequest () {
    ajax('GET', 'api-cart/cart', {}, '', res => {
      console.log(res.data)
      res.data.finishedItemCart.schemeCarts.map(scheme => {
        scheme['schemeCartShow'] = true
        scheme['schemeCartSelected'] = true
        scheme.children.map(room => {
          room['itemCartShow'] = true
          room['itemCartSelected'] = true
          room.itemCarts.map(goods => {
            goods['selected'] = true
          })
        })
      })
      res.data.finishedItemCart.itemCarts.map(goods => {
        goods['selected'] = true
      })
      this.setData({
        allShoppingCart: res.data,
        shoppingCart: res.data.finishedItemCart,
        firstItemCarts: { roomName: '满屋自营', itemCarts: res.data.finishedItemCart.itemCarts, itemCartSelected: true, itemCartShow: true}
      })
    }, () => {

    })
  },
  // 底部全选按钮
  switchAllSelected() {
    this.data.allSelected = !this.data.allSelected
    this.data.shoppingCart.schemeCarts.map(scheme => {
      scheme.schemeCartSelected = this.data.allSelected
      scheme.children.map(room => {
        room.itemCartSelected = this.data.allSelected
        room.itemCarts.map(goods => {
          goods.selected = this.data.allSelected
        })
      })
    })
    this.data.firstItemCarts.itemCarts.map(goods => {
      goods.selected = this.data.allSelected
    })
    this.data.firstItemCarts.itemCartSelected = this.data.allSelected
    this.setData({
      allSelected: this.data.allSelected,
      shoppingCart: this.data.shoppingCart,
      firstItemCarts: this.data.firstItemCarts
    })
  }
})
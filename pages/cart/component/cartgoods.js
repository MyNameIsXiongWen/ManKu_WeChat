// pages/cart/component/cartgoods.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    globalData: app.globalData
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击商品
    clickGoods() {
      wx.navigateTo({
        url: '../goods/goodsDetail/goodsDetail?goodsId=' + this.properties.goods.id + '&detailType=0',
      })
    },
    // 切换商品选中与否
    switchGoodsSelected() {
      this.properties.goods['selected'] = !this.properties.goods.selected
      this.setData({
        goods: this.properties.goods
      })
    },
    minusItemNum(evt) {
      if (this.properties.goods.itemNum > 1) {
        this.properties.goods.itemNum--
      }
      this.setData({
        goods: this.properties.goods
      })
    },
    plusItemNum(evt) {
      if (this.properties.goods.itemNum < 99) {
        this.properties.goods.itemNum++
      }
      this.setData({
        goods: this.properties.goods
      })
    }
  }
})

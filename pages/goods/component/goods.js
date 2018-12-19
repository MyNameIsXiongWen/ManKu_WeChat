const app = getApp()

Component({
  properties: {
    goods: {
      type: Object,
      value: {}
    }
  },
  data: {
    globalData: app.globalData
  },
  methods: {
    //点击商品
    clickGoods() {
      wx.navigateTo({
        url: '../goods/goodsDetail/goodsDetail?goodsId=' + this.properties.goods.id,
      })
    },
  }
})
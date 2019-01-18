// pages/cart/component/roomTitle.js
Component({
  properties: {
    itemcart: {
      type: Object,
      value: {}
    }
  },
  data: {
    
  },
  methods: {
    // 切换itemcart展开收起
    collapseItemCart() {
      this.properties.itemcart.itemCartShow = !this.properties.itemcart.itemCartShow
      this.setData({
        itemcart: this.properties.itemcart
      })
    },
    // 切换itemcart选中与否
    switchItemCartSelected() {
      this.properties.itemcart.itemCartSelected = !this.properties.itemcart.itemCartSelected
      this.setData({
        itemcart: this.properties.itemcart
      })
    }
  }
})

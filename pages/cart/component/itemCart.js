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
      this.properties.itemcart.itemCarts.map(model => {
        model.selected = this.properties.itemcart.itemCartSelected
      })
      this.setData({
        itemcart: this.properties.itemcart
      })
    },
    goodsEvent(val) {
      console.log(this.properties.itemcart.itemCarts[0].selected)
      var allSelected = true
      if (!val.detail) {
        allSelected = false
      }
      else {
        for (var i = 0; i < this.properties.itemcart.itemCarts.length; i++) {
          var model = this.properties.itemcart.itemCarts[i]
          if (!model.selected) {
            allSelected = false
            break
          }
        }
      }
      this.properties.itemcart.itemCartSelected = allSelected
      this.setData({
        itemcart: this.properties.itemcart
      })
      this.triggerEvent('itemCartSelectedEvent', allSelected)
    }
  }
})

// pages/cart/component/schemeTitle.js
Component({
  properties: {
    schemecart: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    // 切换schemecart展开收起
    collapseSchemeCart() {
      this.properties.schemecart.schemeCartShow = !this.properties.schemecart.schemeCartShow
      this.setData({
        schemecart: this.properties.schemecart
      })
    },
    // 切换schemecart选中与否
    switchSchemeCartSelected() {
      this.properties.schemecart.schemeCartSelected = !this.properties.schemecart.schemeCartSelected
      this.properties.schemecart.children.map(model => {
        model.itemCartSelected = this.properties.schemecart.schemeCartSelected
        model.itemCarts.map(goods => {
          goods.selected = this.properties.schemecart.schemeCartSelected
        })
      })
      this.setData({
        schemecart: this.properties.schemecart
      })
    },
    itemCartEvent(val) {
      var allSelected = true
      if (!val.detail) {
        allSelected = false
      }
      else {
        for (var i = 0; i < this.properties.schemecart.children.length; i++) {
          var model = this.properties.schemecart.children[i]
          if (!model.selected) {
            allSelected = false
            break
          }
        }
      }
      this.properties.schemecart.schemeCartSelected = allSelected
      this.setData({
        schemecart: this.properties.schemecart
      })
    }
  }
})

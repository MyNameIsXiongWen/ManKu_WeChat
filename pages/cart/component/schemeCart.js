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
      this.properties.schemecart.show = !this.properties.schemecart.show
      this.setData({
        schemecart: this.properties.schemecart
      })
    },
    // 切换schemecart选中与否
    switchSchemeCartSelected() {
      this.properties.schemecart.selected = !this.properties.schemecart.selected
      this.setData({
        schemecart: this.properties.schemecart
      })
    }
  }
})

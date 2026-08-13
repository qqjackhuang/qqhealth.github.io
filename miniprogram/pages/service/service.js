const store = require('../../utils/store')

Page({
  data: { state: store.load(), large: false },
  onShow() {
    const state = store.load()
    this.setData({ state, large: state.largeFont })
  },
  open(e) {
    wx.navigateTo({ url: '/pages/service-detail/service-detail?id=' + e.currentTarget.dataset.id })
  },
  toggle(e) {
    store.toggleActivity(e.currentTarget.dataset.id)
    this.onShow()
  }
})

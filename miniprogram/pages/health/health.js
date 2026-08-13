const store = require('../../utils/store')

Page({
  data: { state: {}, large: false },
  onShow() {
    const state = store.load()
    this.setData({ state, large: state.largeFont })
  },
  add() {
    wx.navigateTo({ url: '/pages/health-record/health-record' })
  },
  toggleMed(e) {
    store.toggleMed(e.currentTarget.dataset.id)
    this.onShow()
  }
})

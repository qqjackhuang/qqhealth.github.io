const store = require('../../utils/store')

Page({
  data: { state: store.load(), large: false },
  onShow() {
    const state = store.load()
    this.setData({ state, large: state.largeFont })
  },
  bindFamily() {
    wx.navigateTo({ url: '/pages/family-bind/family-bind' })
  },
  visit() {
    wx.navigateTo({ url: '/pages/visit-book/visit-book' })
  },
  message() {
    wx.navigateTo({ url: '/pages/message/message' })
  },
  call(e) {
    wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone.replace(/\s/g, '') })
  }
})

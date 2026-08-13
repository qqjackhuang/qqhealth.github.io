const store = require('../../utils/store')

Page({
  data: { state: {}, large: false },
  onShow() {
    const state = store.load()
    this.setData({ state, large: state.largeFont })
  },
  switchRole() {
    store.update((s) => {
      s.role = s.role === 'elder' ? 'family' : 'elder'
    })
    this.onShow()
    wx.showToast({ title: '已切换身份', icon: 'none' })
  },
  toggleFont() {
    store.update((s) => { s.largeFont = !s.largeFont })
    this.onShow()
  },
  reset() {
    wx.showModal({
      title: '恢复演示数据',
      content: '将清除本机已添加的记录、留言和预约。',
      success: (res) => {
        if (res.confirm) {
          store.reset()
          this.onShow()
        }
      }
    })
  },
  call(e) {
    wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone.replace(/\s/g, '') })
  }
})

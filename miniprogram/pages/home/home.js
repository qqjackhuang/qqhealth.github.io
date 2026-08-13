const store = require('../../utils/store')

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

Page({
  data: {
    greet: greeting(),
    state: {}
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    const state = store.load()
    const who = state.role === 'elder' ? state.elder.name : state.user.family.name
    this.setData({
      state,
      who,
      greet: greeting(),
      large: state.largeFont
    })
  },
  goNotice(e) {
    wx.navigateTo({ url: '/pages/notice-detail/notice-detail?id=' + e.currentTarget.dataset.id })
  },
  goVisit() {
    wx.navigateTo({ url: '/pages/visit-book/visit-book' })
  },
  goHealth() {
    wx.switchTab({ url: '/pages/health/health' })
  },
  goRecord() {
    wx.navigateTo({ url: '/pages/health-record/health-record' })
  },
  goMessage() {
    wx.navigateTo({ url: '/pages/message/message' })
  },
  callSteward() {
    const phone = this.data.state.community.stewardPhone.replace(/\s/g, '')
    wx.makePhoneCall({ phoneNumber: phone })
  },
  sos() {
    wx.showModal({
      title: '紧急呼叫',
      content: '将同时通知公寓值班室与紧急联系人李婷。演示环境不会真正拨号。',
      confirmText: '确认呼叫',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '已通知值班室', icon: 'success' })
        }
      }
    })
  }
})

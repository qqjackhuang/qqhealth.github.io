const store = require('../../utils/store')

Page({
  data: { service: {}, when: '今天下午', note: '' },
  onLoad(query) {
    const state = store.load()
    const service = state.services.find((s) => s.id === query.id) || state.services[0]
    this.setData({ service })
    if (service.id === 's1') {
      wx.redirectTo({ url: '/pages/visit-book/visit-book' })
    }
  },
  onWhen(e) { this.setData({ when: e.detail.value }) },
  onNote(e) { this.setData({ note: e.detail.value }) },
  submit() {
    store.addBooking(this.data.service.id, this.data.when, this.data.note || '无备注')
    wx.showToast({ title: '预约已提交', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  }
})

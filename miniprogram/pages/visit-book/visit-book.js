const store = require('../../utils/store')

Page({
  data: {
    date: '2026-08-16',
    time: '14:00',
    who: '',
    note: ''
  },
  onLoad() {
    const state = store.load()
    this.setData({ who: state.role === 'elder' ? '家属' : state.user.family.name })
  },
  onDate(e) { this.setData({ date: e.detail.value }) },
  onTime(e) { this.setData({ time: e.detail.value }) },
  onWho(e) { this.setData({ who: e.detail.value }) },
  onNote(e) { this.setData({ note: e.detail.value }) },
  submit() {
    if (!this.data.who) {
      wx.showToast({ title: '请填写探望人', icon: 'none' })
      return
    }
    store.addVisit({
      date: this.data.date,
      time: this.data.time,
      who: this.data.who,
      note: this.data.note || '探望',
      status: 'pending'
    })
    wx.showToast({ title: '已提交预约', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  }
})

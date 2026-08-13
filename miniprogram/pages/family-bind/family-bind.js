const store = require('../../utils/store')

Page({
  data: { code: '', hint: '演示邀请码：QQ-8821' },
  onCode(e) {
    this.setData({ code: e.detail.value.toUpperCase() })
  },
  submit() {
    const state = store.load()
    const code = (this.data.code || '').trim().toUpperCase()
    if (code !== state.inviteCode) {
      wx.showToast({ title: '邀请码不正确', icon: 'none' })
      return
    }
    store.update((s) => { s.bound = true })
    wx.showToast({ title: '已加入亲情圈', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  }
})

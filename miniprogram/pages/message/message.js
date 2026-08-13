const store = require('../../utils/store')

Page({
  data: { text: '', state: store.load() },
  onShow() {
    const state = store.load()
    this.setData({ state })
  },
  onText(e) {
    this.setData({ text: e.detail.value })
  },
  send() {
    const text = (this.data.text || '').trim()
    if (!text) return
    const state = store.load()
    store.addMessage(text, state.role)
    this.setData({ text: '' })
    this.onShow()
  }
})

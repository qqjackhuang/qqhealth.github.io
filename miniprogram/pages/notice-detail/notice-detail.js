const store = require('../../utils/store')

Page({
  data: { notice: {} },
  onLoad(query) {
    const state = store.load()
    const notice = state.notices.find((n) => n.id === query.id) || state.notices[0]
    this.setData({ notice })
  }
})

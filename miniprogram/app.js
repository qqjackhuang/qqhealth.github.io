const store = require('./utils/store')

App({
  onLaunch() {
    this.globalData.state = store.load()
  },
  refreshState() {
    this.globalData.state = store.load()
    return this.globalData.state
  },
  globalData: {
    state: null
  }
})

const store = require("../../utils/store");

Page({
  data: { list: [] },
  onShow() {
    this.setData({ list: store.interests() });
  },
  remove(e) {
    store.removeInterest(e.currentTarget.dataset.id);
    wx.showToast({ title: "已删除", icon: "none" });
    this.setData({ list: store.interests() });
  }
});

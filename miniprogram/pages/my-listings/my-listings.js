const store = require("../../utils/store");

Page({
  data: { list: [] },
  onShow() {
    this.setData({ list: store.myListings() });
  },
  goDetail(e) {
    wx.navigateTo({ url: "/pages/detail/detail?id=" + e.currentTarget.dataset.id });
  },
  remove(e) {
    store.removeListing(e.currentTarget.dataset.id);
    wx.showToast({ title: "已下架", icon: "none" });
    this.setData({ list: store.myListings() });
  }
});

const { project } = require("../../data/listings");
const store = require("../../utils/store");

Page({
  data: {
    project,
    featured: []
  },
  onShow() {
    this.setData({ featured: store.listings().slice(0, 3) });
  },
  goListings() {
    wx.switchTab({ url: "/pages/listings/listings" });
  },
  goInterest() {
    wx.navigateTo({ url: "/pages/interest/interest" });
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/detail/detail?id=" + id });
  }
});

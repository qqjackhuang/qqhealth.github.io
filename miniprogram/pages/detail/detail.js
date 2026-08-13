const store = require("../../utils/store");

Page({
  data: { item: null },
  onLoad(query) {
    const item = store.listingById(query.id);
    this.setData({ item });
    if (!item) {
      wx.showToast({ title: "房源不存在", icon: "none" });
    }
  },
  goList() {
    wx.switchTab({ url: "/pages/listings/listings" });
  },
  goInterest() {
    wx.navigateTo({ url: "/pages/interest/interest?listingId=" + this.data.item.id });
  }
});

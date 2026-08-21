const { project } = require("../../data/listings");
const store = require("../../utils/store");

Page({
  data: {
    profile: {},
    interestsCount: 0,
    mineCount: 0,
    total: 0,
    applyCount: 0,
    hotline: project.hotline,
    avatar: "访"
  },
  onShow() {
    const profile = store.profile();
    this.setData({
      profile,
      avatar: (profile.name || "访").slice(0, 1),
      interestsCount: store.interests().length,
      mineCount: store.myListings().length,
      total: store.listings().length,
      applyCount: store.cms.list().length
    });
  },
  goApplications() {
    wx.navigateTo({ url: "/pages/applications/applications" });
  },
  goInterests() {
    wx.navigateTo({ url: "/pages/my-interests/my-interests" });
  },
  goMine() {
    wx.navigateTo({ url: "/pages/my-listings/my-listings" });
  },
  goInterest() {
    wx.navigateTo({ url: "/pages/interest/interest" });
  },
  goPublish() {
    wx.switchTab({ url: "/pages/publish/publish" });
  }
});

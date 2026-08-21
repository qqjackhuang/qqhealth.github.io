const { project } = require("../../data/listings");
const { roles } = require("../../data/roles");
const store = require("../../utils/store");

Page({
  data: {
    project,
    featured: [],
    roles: roles.map((role) => Object.assign({}, role, {
      bannerSrc: "/images/banners/" + role.banner
    }))
  },
  onShow() {
    this.setData({ featured: store.listings().slice(0, 3) });
  },
  openRole(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/apply/apply?role=" + id });
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

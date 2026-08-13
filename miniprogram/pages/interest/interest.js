const store = require("../../utils/store");

Page({
  data: {
    listing: null,
    name: "",
    phone: "",
    layout: "不限",
    layouts: ["不限", "两室", "三室", "四室"],
    budget: "",
    time: "随时",
    times: ["随时", "工作日白天", "晚上", "周末"],
    note: "",
    agree: false
  },
  onLoad(query) {
    const listing = query.listingId ? store.listingById(query.listingId) : null;
    const profile = store.profile();
    this.setData({
      listing,
      name: profile.name === "访客" ? "" : profile.name,
      phone: profile.phone || "",
      layout: listing ? listing.layout : "不限"
    });
  },
  onName(e) { this.setData({ name: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onBudget(e) { this.setData({ budget: e.detail.value }); },
  onNote(e) { this.setData({ note: e.detail.value }); },
  onLayout(e) { this.setData({ layout: this.data.layouts[e.detail.value] }); },
  onTime(e) { this.setData({ time: this.data.times[e.detail.value] }); },
  onAgree(e) { this.setData({ agree: e.detail.value.length > 0 }); },
  submit() {
    const { name, phone, layout, budget, time, note, listing, agree } = this.data;
    if ((name || "").trim().length < 2) {
      return wx.showToast({ title: "请填写真实姓名", icon: "none" });
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return wx.showToast({ title: "请填写 11 位手机号", icon: "none" });
    }
    if (!agree) {
      return wx.showToast({ title: "请先勾选登记说明", icon: "none" });
    }
    store.saveProfile({ id: "me", name: name.trim(), phone });
    store.addInterest({
      name: name.trim(),
      phone,
      layout,
      budget,
      time,
      note,
      listingId: listing ? listing.id : "",
      listingTitle: listing ? listing.title : "项目整体咨询"
    });
    wx.showToast({ title: "登记成功", icon: "success" });
    setTimeout(() => {
      wx.redirectTo({ url: "/pages/my-interests/my-interests" });
    }, 600);
  }
});

const store = require("../../utils/store");

Page({
  data: {
    title: "",
    building: "",
    layout: "三室",
    layouts: ["两室", "三室", "四室"],
    rooms: "",
    area: "",
    floor: "",
    orientation: "南",
    orientations: ["南", "南北", "东南", "西南", "东"],
    price: "",
    desc: "",
    contactName: "",
    contactPhone: "",
    cover: "/images/covers/cover-u1.jpg"
  },
  onTitle(e) { this.setData({ title: e.detail.value }); },
  onBuilding(e) { this.setData({ building: e.detail.value }); },
  onRooms(e) { this.setData({ rooms: e.detail.value }); },
  onArea(e) { this.setData({ area: e.detail.value }); },
  onFloor(e) { this.setData({ floor: e.detail.value }); },
  onPrice(e) { this.setData({ price: e.detail.value }); },
  onDesc(e) { this.setData({ desc: e.detail.value }); },
  onContactName(e) { this.setData({ contactName: e.detail.value }); },
  onContactPhone(e) { this.setData({ contactPhone: e.detail.value }); },
  onLayout(e) { this.setData({ layout: this.data.layouts[e.detail.value] }); },
  onOrientation(e) { this.setData({ orientation: this.data.orientations[e.detail.value] }); },
  choosePhoto() {
    const applyPath = (filePath, size) => {
      if (size && size > 2 * 1024 * 1024) {
        wx.showToast({ title: "图片请小于 2MB", icon: "none" });
        return;
      }
      this.setData({ cover: filePath });
    };
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: (res) => applyPath(res.tempFiles[0].tempFilePath, res.tempFiles[0].size),
        fail: () => {
          wx.chooseImage({
            count: 1,
            success: (res) => applyPath(res.tempFilePaths[0])
          });
        }
      });
      return;
    }
    wx.chooseImage({
      count: 1,
      success: (res) => applyPath(res.tempFilePaths[0])
    });
  },
  submit() {
    const d = this.data;
    const area = Number(d.area);
    const price = Number(d.price);
    if (!d.title.trim() || !d.building.trim() || !d.rooms.trim() || !d.floor.trim() || !d.desc.trim() || !d.contactName.trim()) {
      return wx.showToast({ title: "请完整填写房源信息", icon: "none" });
    }
    if (!(area > 0) || !(price > 0)) {
      return wx.showToast({ title: "请填写正确的面积和价格", icon: "none" });
    }
    if (!/^1[3-9]\d{9}$/.test(d.contactPhone)) {
      return wx.showToast({ title: "请填写 11 位手机号", icon: "none" });
    }
    const listing = store.addListing({
      title: d.title.trim(),
      layout: d.layout,
      rooms: d.rooms.trim(),
      area,
      floor: d.floor.trim(),
      orientation: d.orientation,
      price,
      unitPrice: Math.round((price * 10000) / area),
      building: d.building.trim(),
      tags: ["业主转让", "新发布"],
      cover: d.cover,
      desc: d.desc.trim(),
      features: ["业主发布", "可预约看房"],
      contactName: d.contactName.trim(),
      contactPhone: d.contactPhone
    });
    wx.showToast({ title: "发布成功", icon: "success" });
    setTimeout(() => {
      wx.navigateTo({ url: "/pages/detail/detail?id=" + listing.id });
    }, 500);
  }
});

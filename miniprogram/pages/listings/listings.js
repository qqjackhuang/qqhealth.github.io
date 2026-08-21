const store = require("../../utils/store");

Page({
  data: {
    keyword: "",
    layout: "全部",
    source: "全部",
    layouts: ["全部", "两室", "三室", "四室"],
    list: []
  },
  onShow() {
    this.refresh();
  },
  refresh() {
    const { keyword, layout, source } = this.data;
    const list = store.listings().filter((item) => {
      const okLayout = layout === "全部" || item.layout === layout;
      const okSource =
        source === "全部" ||
        (source === "项目" && item.source === "developer") ||
        (source === "业主" && item.source === "owner");
      const text = (item.title + item.rooms + item.building + (item.tags || []).join("")).toLowerCase();
      const okKey = !keyword || text.indexOf(keyword.toLowerCase()) !== -1;
      return okLayout && okSource && okKey;
    });
    this.setData({ list });
  },
  onSearch(e) {
    this.setData({ keyword: e.detail.value }, () => this.refresh());
  },
  onLayout(e) {
    this.setData({ layout: e.currentTarget.dataset.name, source: "全部" }, () => this.refresh());
  },
  onSource(e) {
    this.setData({ source: e.currentTarget.dataset.name, layout: "全部" }, () => this.refresh());
  },
  goDetail(e) {
    wx.navigateTo({ url: "/pages/detail/detail?id=" + e.currentTarget.dataset.id });
  }
});

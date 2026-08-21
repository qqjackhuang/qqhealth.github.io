const cms = require("../../utils/cms");

const STATUS = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回"
};

function present(roleFilter) {
  const roles = cms.roles;
  const list = cms.list().filter((item) => roleFilter === "all" || item.role === roleFilter);
  return {
    roles,
    roleFilter,
    statusText: STATUS,
    list: list.map((item) => {
      const role = cms.roleById(item.role);
      return Object.assign({}, item, {
        roleTitle: role ? role.title : item.role,
        statusLabel: STATUS[item.status] || item.status
      });
    }),
    total: cms.list().length
  };
}

Page({
  data: present("all"),
  onShow() {
    this.setData(present(this.data.roleFilter || "all"));
  },
  filterRole(e) {
    this.setData(present(e.currentTarget.dataset.id));
  },
  assignRole(e) {
    const id = e.currentTarget.dataset.id;
    const names = cms.roles.map((role) => role.title);
    wx.showActionSheet({
      itemList: names,
      success: (res) => {
        cms.assignRole(id, cms.roles[res.tapIndex].id);
        this.setData(present(this.data.roleFilter));
        wx.showToast({ title: "已改派角色", icon: "success" });
      }
    });
  },
  setStatus(e) {
    cms.setStatus(e.currentTarget.dataset.id, e.currentTarget.dataset.to);
    this.setData(present(this.data.roleFilter));
  }
});

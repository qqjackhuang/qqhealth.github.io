const cms = require("../../utils/cms");

function decorate(role, form) {
  return (role.fields || []).map((field) => {
    const copy = Object.assign({}, field);
    if (field.type === "checks") {
      const selected = form[field.name] || [];
      copy.optionItems = (field.options || []).map((opt) => ({
        value: opt,
        checked: selected.indexOf(opt) >= 0
      }));
    }
    copy.value = form[field.name] || "";
    return copy;
  });
}

Page({
  data: {
    role: null,
    fields: [],
    form: {},
    error: ""
  },
  onLoad(query) {
    const role = cms.roleById(query.role || "steward");
    if (!role) {
      wx.showToast({ title: "未知角色", icon: "none" });
      return;
    }
    wx.setNavigationBarTitle({ title: role.cta });
    const profile = require("../../utils/store").profile();
    const form = {};
    role.fields.forEach((field) => {
      if (field.type === "checks") form[field.name] = [];
      else if (field.name === "name" && profile.name && profile.name !== "访客") form.name = profile.name;
      else if (field.name === "phone") form.phone = profile.phone || "";
      else form[field.name] = "";
    });
    this.setData({
      role,
      form,
      fields: decorate(role, form),
      banner: "/images/banners/" + role.banner
    });
  },
  onInput(e) {
    const name = e.currentTarget.dataset.name;
    const form = this.data.form;
    form[name] = e.detail.value;
    this.setData({ form, fields: decorate(this.data.role, form), error: "" });
  },
  onSelect(e) {
    const name = e.currentTarget.dataset.name;
    const field = this.data.fields.filter((item) => item.name === name)[0];
    const form = this.data.form;
    form[name] = field.options[e.detail.value];
    this.setData({ form, fields: decorate(this.data.role, form) });
  },
  onChecks(e) {
    const name = e.currentTarget.dataset.name;
    const form = this.data.form;
    form[name] = e.detail.value;
    this.setData({ form, fields: decorate(this.data.role, form) });
  },
  submit() {
    const { role, form } = this.data;
    for (let i = 0; i < role.fields.length; i++) {
      const field = role.fields[i];
      if (!field.required) continue;
      const value = form[field.name];
      if (Array.isArray(value) ? !value.length : !String(value || "").trim()) {
        this.setData({ error: "请填写「" + field.label + "」" });
        return;
      }
    }
    if (form.phone && !/^1[3-9]\d{9}$/.test(form.phone)) {
      this.setData({ error: "请填写 11 位手机号" });
      return;
    }
    const fields = {};
    role.fields.forEach((field) => {
      fields[field.name] = form[field.name];
    });
    const store = require("../../utils/store");
    store.saveProfile({
      id: "me",
      name: String(fields.name || "").trim(),
      phone: fields.phone
    });
    cms.add({
      role: role.id,
      name: fields.name,
      phone: fields.phone,
      city: fields.city,
      fields
    });
    wx.showToast({ title: "已提交到集合", icon: "success" });
    setTimeout(() => {
      wx.redirectTo({ url: "/pages/applications/applications" });
    }, 600);
  }
});

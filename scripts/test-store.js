const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.join(__dirname, "..");
const localStorage = {
  data: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
  },
  setItem(key, value) {
    this.data[key] = String(value);
  }
};

const context = {
  window: {},
  localStorage,
  console
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/roles.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/store.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/cms-store.js"), "utf8"), context);

const store = context.QinqingStore;
const cms = context.QinqingCMS;
assert.ok(store.listings().length >= 8, "seed listings");
assert.strictEqual(context.QINQING_ROLES.length, 4, "four roles");
assert.ok(cms.list().length >= 4, "seed applications");
assert.strictEqual(new Set(cms.list().map((d) => d.role)).size, 4, "four roles in one collection");

const created = store.addListing({
  title: "测试业主房源",
  layout: "三室",
  rooms: "3室2厅1卫",
  area: 100,
  floor: "2 / 18",
  orientation: "南",
  price: 200,
  unitPrice: 20000,
  building: "测试楼",
  tags: ["业主转让"],
  cover: "cover-u1.jpg",
  desc: "测试",
  features: ["测试"],
  contactName: "测试",
  contactPhone: "13800138000"
});
assert.ok(created.id, "listing id");
assert.strictEqual(store.listingById(created.id).title, "测试业主房源");
assert.strictEqual(store.myListings().length, 1);

store.addInterest({
  name: "张三",
  phone: "13900139000",
  layout: "三室",
  budget: "250",
  time: "晚上",
  note: "想看低楼层",
  listingId: created.id,
  listingTitle: created.title
});
assert.strictEqual(store.interests().length, 1);
store.removeInterest(store.interests()[0].id);
assert.strictEqual(store.interests().length, 0);
store.removeListing(created.id);
assert.strictEqual(store.listingById(created.id), null);

const appDoc = cms.add({
  role: "steward",
  name: "测试店主",
  phone: "13800138001",
  city: "上海",
  fields: {
    name: "测试店主",
    phone: "13800138001",
    city: "上海",
    community: "测试小区",
    storeType: "便利店",
    storeName: "测试店",
    services: ["代收快递"]
  }
});
assert.ok(appDoc.id, "application id");
assert.strictEqual(appDoc.role, "steward");
assert.strictEqual(appDoc.status, "pending");
const reassigned = cms.assignRole(appDoc.id, "provider");
assert.strictEqual(reassigned.role, "provider", "assign role in same collection");
cms.setStatus(appDoc.id, "approved");
assert.strictEqual(cms.byId(appDoc.id).status, "approved");

const exported = JSON.parse(cms.exportJSON());
assert.strictEqual(exported.collection, "role_applications");
assert.ok(exported.documents.some((d) => d.id === appDoc.id));

console.log("store tests passed");

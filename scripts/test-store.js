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
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/store.js"), "utf8"), context);

const store = context.QinqingStore;
assert.ok(store.listings().length >= 8, "seed listings");

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

console.log("store tests passed");

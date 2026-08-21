const pack = require("../data/roles");

const KEY = "qinqing_cms_applications";
const SEEDED = "qinqing_cms_seeded_v1";

function read() {
  try {
    return wx.getStorageSync(KEY) || [];
  } catch (e) {
    return [];
  }
}

function write(list) {
  wx.setStorageSync(KEY, list);
}

function uid(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function normalize(doc) {
  const fields = doc.fields || {};
  const item = {
    id: doc.id,
    role: doc.role,
    status: doc.status || "pending",
    name: doc.name || fields.name || "",
    phone: doc.phone || fields.phone || "",
    city: doc.city || fields.city || "",
    createdAt: doc.createdAt || Date.now(),
    updatedAt: doc.updatedAt || doc.createdAt || Date.now(),
    fields
  };
  item.summary = pack.summarize(item);
  return item;
}

function ensureSeed() {
  if (wx.getStorageSync(SEEDED) === "1") return;
  if (!read().length && pack.seed && pack.seed.length) {
    write(pack.seed.map(normalize));
  }
  wx.setStorageSync(SEEDED, "1");
}

function list() {
  ensureSeed();
  return read().map(normalize);
}

function byId(id) {
  return list().filter((item) => item.id === id)[0] || null;
}

function add(payload) {
  ensureSeed();
  if (!pack.roleById(payload.role)) {
    throw new Error("unknown role");
  }
  const doc = normalize({
    id: uid("app"),
    role: payload.role,
    status: "pending",
    name: payload.name,
    phone: payload.phone,
    city: payload.city,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fields: payload.fields || {}
  });
  const next = list();
  next.unshift(doc);
  write(next);
  return doc;
}

function update(id, patch) {
  const next = list().map((item) => {
    if (item.id !== id) return item;
    const merged = {
      id: item.id,
      role: patch.role || item.role,
      status: patch.status || item.status,
      createdAt: item.createdAt,
      updatedAt: Date.now(),
      fields: Object.assign({}, item.fields, patch.fields || {})
    };
    merged.name = merged.fields.name || item.name;
    merged.phone = merged.fields.phone || item.phone;
    merged.city = merged.fields.city || item.city;
    return normalize(merged);
  });
  write(next);
  return next.filter((item) => item.id === id)[0] || null;
}

function mine() {
  const profile = wx.getStorageSync("qinqing_profile") || {};
  const phone = profile.phone;
  if (!phone) return list().filter((item) => item.id.indexOf("seed-") !== 0).slice(0, 0);
  return list().filter((item) => item.phone === phone);
}

module.exports = {
  list,
  byId,
  add,
  update,
  assignRole(id, role) {
    return update(id, { role });
  },
  setStatus(id, status) {
    return update(id, { status });
  },
  mine,
  ensureSeed,
  roles: pack.roles,
  roleById: pack.roleById,
  meta: pack.meta
};

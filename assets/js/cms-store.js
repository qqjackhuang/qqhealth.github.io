(function (root) {
  var KEY = "qinqing_cms_applications";
  var SEEDED = "qinqing_cms_seeded_v1";

  function api() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./roles.js");
      } catch (e) {
        return require("../assets/js/roles.js");
      }
    }
    return {
      roles: root.QINQING_ROLES,
      roleById: root.QINQING_ROLE_BY_ID,
      summarize: root.QINQING_SUMMARIZE,
      seed: root.QINQING_CMS_SEED || [],
      meta: root.QINQING_CMS_META
    };
  }

  function storage() {
    if (typeof localStorage !== "undefined") return localStorage;
    if (!root.__memoryStorage) {
      var data = {};
      root.__memoryStorage = {
        getItem: function (k) {
          return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
        },
        setItem: function (k, v) {
          data[k] = String(v);
        }
      };
    }
    return root.__memoryStorage;
  }

  function readList() {
    try {
      var raw = storage().getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeList(list) {
    storage().setItem(KEY, JSON.stringify(list));
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function normalize(doc, pack) {
    var fields = doc.fields || {};
    var item = {
      id: doc.id,
      role: doc.role,
      status: doc.status || "pending",
      name: doc.name || fields.name || "",
      phone: doc.phone || fields.phone || "",
      city: doc.city || fields.city || "",
      createdAt: doc.createdAt || Date.now(),
      updatedAt: doc.updatedAt || doc.createdAt || Date.now(),
      fields: fields
    };
    item.summary = pack.summarize(item);
    return item;
  }

  function ensureSeed(pack) {
    if (storage().getItem(SEEDED) === "1") return;
    if (!readList().length && pack.seed && pack.seed.length) {
      writeList(pack.seed.map(function (item) {
        return normalize(item, pack);
      }));
    }
    storage().setItem(SEEDED, "1");
  }

  var CMS = {
    key: KEY,
    list: function () {
      var pack = api();
      ensureSeed(pack);
      return readList().map(function (item) {
        return normalize(item, pack);
      });
    },
    byId: function (id) {
      return this.list().filter(function (item) {
        return item.id === id;
      })[0] || null;
    },
    add: function (payload) {
      var pack = api();
      ensureSeed(pack);
      if (!pack.roleById(payload.role)) {
        throw new Error("unknown role");
      }
      var doc = normalize({
        id: uid("app"),
        role: payload.role,
        status: "pending",
        name: payload.name,
        phone: payload.phone,
        city: payload.city,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        fields: payload.fields || {}
      }, pack);
      var list = this.list();
      list.unshift(doc);
      writeList(list);
      return doc;
    },
    update: function (id, patch) {
      var pack = api();
      var next = this.list().map(function (item) {
        if (item.id !== id) return item;
        var merged = {
          id: item.id,
          role: patch.role || item.role,
          status: patch.status || item.status,
          name: item.name,
          phone: item.phone,
          city: item.city,
          createdAt: item.createdAt,
          updatedAt: Date.now(),
          fields: Object.assign({}, item.fields, patch.fields || {})
        };
        merged.name = merged.fields.name || merged.name;
        merged.phone = merged.fields.phone || merged.phone;
        merged.city = merged.fields.city || merged.city;
        return normalize(merged, pack);
      });
      writeList(next);
      return next.filter(function (item) {
        return item.id === id;
      })[0] || null;
    },
    assignRole: function (id, role) {
      return this.update(id, { role: role });
    },
    setStatus: function (id, status) {
      return this.update(id, { status: status });
    },
    remove: function (id) {
      writeList(this.list().filter(function (item) {
        return item.id !== id;
      }));
    },
    exportJSON: function () {
      var pack = api();
      return JSON.stringify({
        collection: (pack.meta || {}).collection || "role_applications",
        documents: this.list()
      }, null, 2);
    }
  };

  root.QinqingCMS = CMS;
  if (root.QinqingStore) {
    root.QinqingStore.applications = function () { return CMS.list(); };
    root.QinqingStore.addApplication = function (payload) { return CMS.add(payload); };
    root.QinqingStore.assignApplicationRole = function (id, role) { return CMS.assignRole(id, role); };
    root.QinqingStore.setApplicationStatus = function (id, status) { return CMS.setStatus(id, status); };
  }
  if (typeof module === "object" && module.exports) {
    module.exports = CMS;
  }
})(typeof window !== "undefined" ? window : this);

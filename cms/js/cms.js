(function () {
  var state = { role: "all", status: "all", current: null };

  function $(id) { return document.getElementById(id); }

  function roleLabel(id) {
    var role = QINQING_ROLE_BY_ID(id);
    return role ? role.title : id;
  }

  function statusLabel(id) {
    var hit = (QINQING_CMS_META.statuses || []).filter(function (s) { return s.id === id; })[0];
    return hit ? hit.label : id;
  }

  function filtered() {
    return QinqingCMS.list().filter(function (doc) {
      var okRole = state.role === "all" || doc.role === state.role;
      var okStatus = state.status === "all" || doc.status === state.status;
      return okRole && okStatus;
    });
  }

  function counts() {
    var list = QinqingCMS.list();
    var map = { all: list.length };
    QINQING_ROLES.forEach(function (role) {
      map[role.id] = list.filter(function (d) { return d.role === role.id; }).length;
    });
    return map;
  }

  function fmtTime(ts) {
    var d = new Date(ts);
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
  }

  function renderSide() {
    var c = counts();
    $("filters").innerHTML =
      '<button class="filter' + (state.role === "all" ? " active" : "") + '" data-role="all">全部<span class="count">' + c.all + "</span></button>" +
      QINQING_ROLES.map(function (role) {
        return '<button class="filter' + (state.role === role.id ? " active" : "") + '" data-role="' + role.id + '">' +
          role.title + '<span class="count">' + (c[role.id] || 0) + "</span></button>";
      }).join("");
    $("filters").querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.role = btn.getAttribute("data-role");
        render();
      });
    });
  }

  function renderTable() {
    var list = filtered();
    var roleOptions = QINQING_ROLES.map(function (role) {
      return '<option value="' + role.id + '">' + role.title + "</option>";
    }).join("");
    if (!list.length) {
      $("table-wrap").innerHTML = '<div class="empty">这个筛选下还没有记录</div>';
      return;
    }
    $("table-wrap").innerHTML =
      "<table><thead><tr>" +
        "<th>姓名</th><th>角色</th><th>手机</th><th>摘要</th><th>状态</th><th>提交</th><th>操作</th>" +
      "</tr></thead><tbody>" +
      list.map(function (doc) {
        return "<tr>" +
          "<td>" + doc.name + '<div class="muted">' + (doc.city || "") + "</div></td>" +
          "<td><span class='role-tag'>" + roleLabel(doc.role) + "</span></td>" +
          "<td>" + doc.phone + "</td>" +
          "<td>" + (doc.summary || "") + "</td>" +
          "<td><span class='status-tag status-" + doc.status + "'>" + statusLabel(doc.status) + "</span></td>" +
          "<td>" + fmtTime(doc.createdAt) + "</td>" +
          "<td><div class='row-actions'>" +
            "<button data-view='" + doc.id + "'>查看</button>" +
            "<select data-assign='" + doc.id + "'>" +
              "<option value=''>分配角色</option>" + roleOptions +
            "</select>" +
            "<button data-status='" + doc.id + "' data-to='approved'>通过</button>" +
            "<button data-status='" + doc.id + "' data-to='rejected'>驳回</button>" +
          "</div></td>" +
        "</tr>";
      }).join("") +
      "</tbody></table>";

    $("table-wrap").querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.current = QinqingCMS.byId(btn.getAttribute("data-view"));
        renderDrawer();
      });
    });
    $("table-wrap").querySelectorAll("[data-assign]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        if (!sel.value) return;
        QinqingCMS.assignRole(sel.getAttribute("data-assign"), sel.value);
        render();
      });
    });
    $("table-wrap").querySelectorAll("[data-status]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        QinqingCMS.setStatus(btn.getAttribute("data-status"), btn.getAttribute("data-to"));
        render();
      });
    });
  }

  function renderDrawer() {
    var host = $("drawer");
    if (!state.current) {
      host.hidden = true;
      host.innerHTML = "";
      return;
    }
    var doc = QinqingCMS.byId(state.current.id) || state.current;
    var role = QINQING_ROLE_BY_ID(doc.role);
    var rows = Object.keys(doc.fields || {}).map(function (key) {
      var field = (role.fields || []).filter(function (f) { return f.name === key; })[0];
      var label = field ? field.label : key;
      var value = doc.fields[key];
      if (Array.isArray(value)) value = value.join("、");
      return "<b>" + label + "</b><span>" + (value || "—") + "</span>";
    }).join("");
    host.hidden = false;
    host.innerHTML =
      "<h2>" + doc.name + "</h2>" +
      '<p class="muted">' + roleLabel(doc.role) + " · " + statusLabel(doc.status) + " · " + doc.id + "</p>" +
      '<div class="kv">' + rows + "</div>" +
      '<button class="btn" id="close-drawer" style="margin-top:18px">关闭</button>';
    $("close-drawer").addEventListener("click", function () {
      state.current = null;
      renderDrawer();
    });
  }

  function render() {
    $("meta").textContent = QINQING_CMS_META.collectionHint;
    $("collection").textContent = QINQING_CMS_META.collectionTitle + " · " + QINQING_CMS_META.collection;
    renderSide();
    renderTable();
    renderDrawer();
  }

  $("status-filter").innerHTML =
    '<option value="all">全部状态</option>' +
    QINQING_CMS_META.statuses.map(function (s) {
      return '<option value="' + s.id + '">' + s.label + "</option>";
    }).join("");
  $("status-filter").addEventListener("change", function () {
    state.status = this.value;
    render();
  });
  $("export-btn").addEventListener("click", function () {
    var blob = new Blob([QinqingCMS.exportJSON()], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "role_applications.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  render();
})();

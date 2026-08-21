(function () {
  var roleId = document.body.getAttribute("data-role");
  var role = QINQING_ROLE_BY_ID(roleId);
  var root = document.getElementById("app");
  var accent = role ? role.accent : "#c45c26";

  function bannerSrc() {
    return "../assets/images/" + role.banner;
  }

  function fieldControl(field) {
    var req = field.required ? '<span class="req">*</span>' : "";
    var label = '<label>' + field.label + req + "</label>";
    if (field.type === "textarea") {
      return '<div class="field">' + label +
        '<textarea name="' + field.name + '" placeholder="' + (field.placeholder || "") + '"></textarea></div>';
    }
    if (field.type === "select") {
      var opts = ['<option value="">请选择</option>'].concat(
        (field.options || []).map(function (opt) {
          return '<option value="' + opt + '">' + opt + "</option>";
        })
      ).join("");
      return '<div class="field">' + label + '<select name="' + field.name + '">' + opts + "</select></div>";
    }
    if (field.type === "checks") {
      var boxes = (field.options || []).map(function (opt) {
        return '<label class="check"><input type="checkbox" name="' + field.name + '" value="' + opt + '">' + opt + "</label>";
      }).join("");
      return '<div class="field">' + label + '<div class="checks">' + boxes + "</div></div>";
    }
    var inputType = field.type === "tel" ? "tel" : field.type === "number" ? "number" : "text";
    var extra = field.maxlength ? ' maxlength="' + field.maxlength + '"' : "";
    return '<div class="field">' + label +
      '<input type="' + inputType + '" name="' + field.name + '" placeholder="' + (field.placeholder || "") + '"' + extra + "></div>";
  }

  function readForm(form) {
    var data = {};
    role.fields.forEach(function (field) {
      if (field.type === "checks") {
        data[field.name] = Array.prototype.map.call(
          form.querySelectorAll('[name="' + field.name + '"]:checked'),
          function (el) { return el.value; }
        );
      } else {
        var el = form.querySelector('[name="' + field.name + '"]');
        data[field.name] = el ? String(el.value || "").trim() : "";
      }
    });
    return data;
  }

  function validate(data) {
    for (var i = 0; i < role.fields.length; i++) {
      var field = role.fields[i];
      if (!field.required) continue;
      var value = data[field.name];
      if (Array.isArray(value) ? !value.length : !value) {
        return "请填写「" + field.label + "」";
      }
    }
    if (data.phone && !/^1[3-9]\d{9}$/.test(data.phone)) {
      return "请填写 11 位手机号";
    }
    return "";
  }

  function renderForm() {
    document.title = role.cta + " · 亲情管家";
    root.innerHTML =
      '<div class="wrap">' +
        '<div class="topnav"><a href="../index.html">‹ 返回小程序首页</a><a href="../cms/index.html">CMS 后台</a></div>' +
        '<section class="hero">' +
          '<img src="' + bannerSrc() + '" alt="' + role.title + '">' +
          '<div class="hero-mask">' +
            '<div class="eyebrow">' + role.eyebrow + "</div>" +
            "<h1>" + role.title + "</h1>" +
            "<p>" + role.subtitle + " · " + role.desc + "</p>" +
          "</div>" +
        "</section>" +
        '<div class="card intro">' + role.intro + "</div>" +
        '<form class="card form" id="join-form">' +
          role.fields.map(fieldControl).join("") +
          '<p class="hint">提交后写入 CMS 集合「入驻申请」（role_applications），角色记为「' + role.title + '」。</p>' +
          '<p class="error" id="err" hidden></p>' +
          '<button class="btn" type="submit" style="background:' + accent + '">' + role.cta + "</button>" +
        "</form>" +
        '<p class="footer">亲情管家 · 四个入口，一个集合，按角色分流</p>' +
      "</div>";

    var form = document.getElementById("join-form");
    var err = document.getElementById("err");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = readForm(form);
      var message = validate(fields);
      if (message) {
        err.hidden = false;
        err.textContent = message;
        return;
      }
      QinqingCMS.add({
        role: role.id,
        name: fields.name,
        phone: fields.phone,
        city: fields.city,
        fields: fields
      });
      renderDone(fields.name);
    });
  }

  function renderDone(name) {
    root.innerHTML =
      '<div class="wrap">' +
        '<div class="topnav"><a href="../index.html">‹ 返回小程序首页</a><a href="../cms/index.html">去 CMS 查看</a></div>' +
        '<div class="card success">' +
          "<h2>已提交</h2>" +
          "<p>" + (name || "您") + " 的「" + role.title + "」资料已写入集合 <b>入驻申请</b>。" +
          "可在 CMS 里按角色筛选，也可以把这条记录改派给其他角色。</p>" +
          '<div class="actions">' +
            '<a class="btn-ghost" href="../cms/index.html" style="display:flex;align-items:center;justify-content:center">打开 CMS</a>' +
            '<a class="btn-ghost" href="../index.html" style="display:flex;align-items:center;justify-content:center">返回首页</a>' +
          "</div>" +
        "</div>" +
      "</div>";
  }

  if (!role) {
    root.textContent = "未知角色";
    return;
  }
  renderForm();
})();

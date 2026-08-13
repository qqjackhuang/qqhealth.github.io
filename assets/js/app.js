(function () {
  var IMG = "assets/images/";
  var app = document.getElementById("app");
  var navTitle = document.getElementById("nav-title");
  var navBack = document.getElementById("nav-back");
  var toastEl = document.getElementById("toast");
  var clockEl = document.getElementById("clock");

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var d = new Date();
    clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  tick();
  setInterval(tick, 15000);

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }

  function parseHash() {
    var raw = (location.hash || "#/").replace(/^#/, "");
    if (raw.charAt(0) !== "/") raw = "/" + raw;
    var parts = raw.split("?");
    var path = parts[0] || "/";
    var query = {};
    if (parts[1]) {
      parts[1].split("&").forEach(function (pair) {
        var kv = pair.split("=");
        query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
      });
    }
    return { path: path, query: query };
  }

  function go(path) {
    location.hash = path.charAt(0) === "#" ? path : "#" + path;
  }

  function coverUrl(name) {
    if (!name) return IMG + "cover-a1.jpg";
    if (name.indexOf("data:") === 0) return name;
    return IMG + name;
  }

  function fmtPrice(n) {
    return Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 1);
  }

  function houseCard(item) {
    var badge = item.source === "owner" ? '<span class="badge owner">业主转让</span>' : '<span class="badge">项目房源</span>';
    return (
      '<a class="house-card" href="#/listing?id=' + encodeURIComponent(item.id) + '">' +
        '<div class="cover">' + badge + '<img src="' + coverUrl(item.cover) + '" alt="' + item.title + '"></div>' +
        '<div class="house-body">' +
          "<h4>" + item.title + "</h4>" +
          '<div class="meta">' + item.rooms + " · " + item.area + "㎡ · " + item.orientation + " · " + item.floor + "层</div>" +
          '<div class="price">' + fmtPrice(item.price) + '万 <small>' + item.unitPrice + " 元/㎡</small></div>" +
          '<div class="tags">' + (item.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function setNav(title, back) {
    navTitle.textContent = title;
    navBack.classList.toggle("show", !!back);
  }

  function setTab(name) {
    document.querySelectorAll(".tab-item").forEach(function (el) {
      var active = el.getAttribute("data-tab") === name;
      el.classList.toggle("active", active);
      var img = el.querySelector("img");
      var key = el.getAttribute("data-tab");
      img.src = IMG + "tab-" + key + (active ? "-active" : "") + ".png";
    });
  }

  function renderHome() {
    setNav("和悦亲情公寓", false);
    setTab("home");
    var project = QINQING_SEED.project;
    var featured = QinqingStore.listings().slice(0, 3);
    app.innerHTML =
      '<section class="hero">' +
        '<img src="' + IMG + 'hero.jpg" alt="社区效果">' +
        '<div class="hero-mask">' +
          '<div class="eyebrow">FAMILY APARTMENT</div>' +
          "<h2>" + project.name + "</h2>" +
          "<p>" + project.slogan + "</p>" +
        "</div>" +
      "</section>" +
      '<section class="section">' +
        '<div class="section-head"><h3>项目亮点</h3><a href="#/listings">全部房源</a></div>' +
        '<div class="highlights">' + project.highlights.map(function (h) {
          return '<div class="hl-card"><strong>' + h.title + "</strong><span>" + h.desc + "</span></div>";
        }).join("") + "</div>" +
        '<div class="stats">' +
          '<div class="stat"><b>' + project.openDate + "</b><small>销售状态</small></div>" +
          '<div class="stat"><b>' + project.greening + "</b><small>绿地率</small></div>" +
          '<div class="stat"><b>' + project.parking + "</b><small>车位配比</small></div>" +
        "</div>" +
      "</section>" +
      '<section class="section">' +
        '<div class="section-head"><h3>热门房源</h3><a href="#/listings">查看更多</a></div>' +
        '<div class="card-list">' + featured.map(houseCard).join("") + "</div>" +
      "</section>" +
      '<section class="section" style="padding-bottom:20px">' +
        '<div class="project-box">' + project.intro +
          "<br><br>地址：" + project.address + "<br>热线：" + project.hotline +
        "</div>" +
        '<div class="bottom-cta" style="position:static;margin:14px 0 0">' +
          '<button class="btn btn-ghost" data-go="#/interest">意向登记</button>' +
          '<button class="btn btn-primary" data-go="#/listings">浏览房源</button>' +
        "</div>" +
      "</section>";
  }

  function renderListings(query) {
    setNav("房源列表", false);
    setTab("listings");
    var keyword = (query.q || "").trim();
    var layout = query.layout || "全部";
    var source = query.source || "全部";
    var list = QinqingStore.listings().filter(function (item) {
      var okLayout = layout === "全部" || item.layout === layout;
      var okSource = source === "全部" || (source === "项目" && item.source === "developer") || (source === "业主" && item.source === "owner");
      var text = (item.title + item.rooms + item.building + (item.tags || []).join("")).toLowerCase();
      var okKey = !keyword || text.indexOf(keyword.toLowerCase()) !== -1;
      return okLayout && okSource && okKey;
    });
    var chips = ["全部", "两室", "三室", "四室"].map(function (name) {
      return '<button class="chip' + (layout === name ? " active" : "") + '" data-layout="' + name + '">' + name + "</button>";
    }).join("") +
      '<button class="chip' + (source === "业主" ? " active" : "") + '" data-source="业主">业主转让</button>' +
      '<button class="chip' + (source === "项目" ? " active" : "") + '" data-source="项目">项目房源</button>';

    app.innerHTML =
      '<div class="search-row"><input id="q" placeholder="搜索楼栋、户型、标签" value="' + keyword.replace(/"/g, "&quot;") + '"></div>' +
      '<div class="filters">' + chips + "</div>" +
      '<section class="section"><div class="section-head"><h3>共 ' + list.length + " 套房源</h3></div>" +
        (list.length ? '<div class="card-list">' + list.map(houseCard).join("") + "</div>" : '<div class="empty"><strong>没有符合条件的房源</strong>试试换个筛选条件</div>') +
      "</section>";

    var input = document.getElementById("q");
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") applyListFilter({ q: input.value, layout: layout, source: source });
    });
    app.querySelectorAll("[data-layout]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyListFilter({ q: input.value, layout: btn.getAttribute("data-layout"), source: "全部" });
      });
    });
    app.querySelectorAll("[data-source]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyListFilter({ q: input.value, layout: "全部", source: btn.getAttribute("data-source") });
      });
    });
  }

  function applyListFilter(opts) {
    var params = [];
    if (opts.q) params.push("q=" + encodeURIComponent(opts.q));
    if (opts.layout && opts.layout !== "全部") params.push("layout=" + encodeURIComponent(opts.layout));
    if (opts.source && opts.source !== "全部") params.push("source=" + encodeURIComponent(opts.source));
    go("/listings" + (params.length ? "?" + params.join("&") : ""));
  }

  function renderDetail(query) {
    var item = QinqingStore.listingById(query.id);
    setTab("listings");
    if (!item) {
      setNav("房源详情", true);
      app.innerHTML = '<div class="empty"><strong>房源不存在</strong>可能已下架</div>';
      return;
    }
    setNav("房源详情", true);
    var badge = item.source === "owner" ? '<span class="badge owner">业主转让</span>' : '<span class="badge">项目房源</span>';
    app.innerHTML =
      '<div class="detail-cover">' + badge + '<img src="' + coverUrl(item.cover) + '" alt=""></div>' +
      '<div class="detail-panel">' +
        "<h2 style=\"font-size:18px;margin-bottom:6px\">" + item.title + "</h2>" +
        '<div class="price">' + fmtPrice(item.price) + '万 <small>约 ' + item.unitPrice + " 元/㎡</small></div>" +
        '<div class="kv">' +
          "<div>户型<b>" + item.rooms + "</b></div>" +
          "<div>建筑面积<b>" + item.area + "㎡</b></div>" +
          "<div>朝向<b>" + item.orientation + "</b></div>" +
          "<div>楼层<b>" + item.floor + "</b></div>" +
          "<div>楼栋<b>" + item.building + "</b></div>" +
          "<div>来源<b>" + (item.source === "owner" ? "业主发布" : "开发商") + "</b></div>" +
        "</div>" +
        '<div class="tags" style="margin-top:12px">' + (item.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
      "</div>" +
      '<section class="section"><h3>户型说明</h3><p class="prose" style="margin-top:8px">' + item.desc + "</p>" +
        '<div class="feature-pills">' + (item.features || []).map(function (f) { return "<span>" + f + "</span>"; }).join("") + "</div>" +
      "</section>" +
      (item.contactName ? '<section class="section"><div class="project-box">业主联系人：' + item.contactName + "　" + item.contactPhone + "</div></section>" : "") +
      '<div class="bottom-cta">' +
        '<button class="btn btn-ghost" data-go="#/listings">返回列表</button>' +
        '<button class="btn btn-primary" data-go="#/interest?listingId=' + encodeURIComponent(item.id) + '">登记购买意向</button>' +
      "</div>";
  }

  function renderInterest(query) {
    setNav("购买意向登记", true);
    setTab("home");
    var listing = query.listingId ? QinqingStore.listingById(query.listingId) : null;
    var profile = QinqingStore.profile();
    app.innerHTML =
      (listing ? '<section class="section"><div class="project-box">意向房源：' + listing.title + "　" + fmtPrice(listing.price) + "万</div></section>" : "") +
      '<form class="form" id="interest-form">' +
        '<div class="field"><label>姓名</label><input name="name" maxlength="10" required placeholder="怎么称呼您" value="' + (profile.name === "访客" ? "" : profile.name) + '"></div>' +
        '<div class="field"><label>手机号</label><input name="phone" maxlength="11" inputmode="numeric" required placeholder="用于顾问回访" value="' + (profile.phone || "") + '"></div>' +
        '<div class="field"><label>意向户型</label>' +
          '<select name="layout">' +
            ["不限", "两室", "三室", "四室"].map(function (n) {
              var selected = listing && listing.layout === n ? " selected" : "";
              return '<option value="' + n + '"' + selected + ">" + n + "</option>";
            }).join("") +
          "</select></div>" +
        '<div class="field"><label>预算（万元）</label><input name="budget" inputmode="decimal" placeholder="例如 280"></div>' +
        '<div class="field"><label>方便联系时段</label>' +
          '<select name="time"><option>随时</option><option>工作日白天</option><option>晚上</option><option>周末</option></select></div>' +
        '<div class="field"><label>补充说明</label><textarea name="note" placeholder="例如希望低楼层、要车位、需要学区等"></textarea></div>' +
        '<label class="check"><input type="checkbox" name="agree" required><span>我已了解本登记仅用于项目顾问回访，不构成购房合同。</span></label>' +
        '<button class="btn btn-primary btn-block" type="submit">提交意向</button>' +
        '<p class="hint">提交后可在「我的」中查看登记记录。</p>' +
      "</form>";

    document.getElementById("interest-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var name = String(fd.get("name") || "").trim();
      var phone = String(fd.get("phone") || "").trim();
      if (name.length < 2) return toast("请填写真实姓名");
      if (!/^1[3-9]\d{9}$/.test(phone)) return toast("请填写 11 位手机号");
      QinqingStore.saveProfile({ id: "me", name: name, phone: phone });
      QinqingStore.addInterest({
        name: name,
        phone: phone,
        layout: fd.get("layout"),
        budget: fd.get("budget"),
        time: fd.get("time"),
        note: fd.get("note"),
        listingId: listing ? listing.id : "",
        listingTitle: listing ? listing.title : "项目整体咨询"
      });
      toast("登记成功，顾问将尽快联系您");
      setTimeout(function () { go("/my-interests"); }, 700);
    });
  }

  function renderPublish() {
    setNav("发布出售房源", false);
    setTab("publish");
    app.innerHTML =
      '<section class="section"><div class="project-box">仅限本社区业主发布二手房源。信息将展示在房源列表，并标注「业主转让」。</div></section>' +
      '<form class="form" id="publish-form">' +
        '<div class="field"><label>房源标题</label><input name="title" maxlength="30" required placeholder="例如 3 号楼南向三室急售"></div>' +
        '<div class="field"><label>楼栋</label><input name="building" maxlength="12" required placeholder="例如 8 号楼"></div>' +
        '<div class="field"><label>户型</label>' +
          '<select name="layout"><option>两室</option><option selected>三室</option><option>四室</option></select></div>' +
        '<div class="field"><label>户型结构</label><input name="rooms" required placeholder="例如 3室2厅1卫"></div>' +
        '<div class="field"><label>建筑面积（㎡）</label><input name="area" inputmode="decimal" required placeholder="例如 108"></div>' +
        '<div class="field"><label>楼层</label><input name="floor" required placeholder="例如 11 / 18"></div>' +
        '<div class="field"><label>朝向</label>' +
          '<select name="orientation"><option>南</option><option>南北</option><option>东南</option><option>西南</option><option>东</option></select></div>' +
        '<div class="field"><label>期望售价（万元）</label><input name="price" inputmode="decimal" required placeholder="例如 260"></div>' +
        '<div class="field"><label>房源介绍</label><textarea name="desc" required placeholder="装修、满二满五、看房时间、是否含车位等"></textarea></div>' +
        '<div class="field"><label>联系人</label><input name="contactName" maxlength="10" required placeholder="怎么称呼"></div>' +
        '<div class="field"><label>联系电话</label><input name="contactPhone" maxlength="11" inputmode="numeric" required></div>' +
        '<div class="field"><label>封面图片（可选）</label><input name="photo" type="file" accept="image/*"><p class="hint">不上传则使用默认社区封面。</p></div>' +
        '<button class="btn btn-sage btn-block" type="submit">发布房源</button>' +
      "</form>";

    var fileData = "";
    var photo = app.querySelector('input[name="photo"]');
    photo.addEventListener("change", function () {
      var file = photo.files && photo.files[0];
      if (!file) { fileData = ""; return; }
      if (file.size > 2 * 1024 * 1024) {
        toast("图片请小于 2MB");
        photo.value = "";
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { fileData = reader.result; };
      reader.readAsDataURL(file);
    });

    document.getElementById("publish-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var area = Number(fd.get("area"));
      var price = Number(fd.get("price"));
      var phone = String(fd.get("contactPhone") || "").trim();
      if (!(area > 0) || !(price > 0)) return toast("请填写正确的面积和价格");
      if (!/^1[3-9]\d{9}$/.test(phone)) return toast("请填写 11 位手机号");
      var listing = QinqingStore.addListing({
        title: String(fd.get("title")).trim(),
        layout: fd.get("layout"),
        rooms: String(fd.get("rooms")).trim(),
        area: area,
        floor: String(fd.get("floor")).trim(),
        orientation: fd.get("orientation"),
        price: price,
        unitPrice: Math.round(price * 10000 / area),
        building: String(fd.get("building")).trim(),
        tags: ["业主转让", "新发布"],
        cover: fileData || "cover-u1.jpg",
        desc: String(fd.get("desc")).trim(),
        features: ["业主发布", "可预约看房"],
        contactName: String(fd.get("contactName")).trim(),
        contactPhone: phone
      });
      toast("发布成功");
      setTimeout(function () { go("/listing?id=" + encodeURIComponent(listing.id)); }, 600);
    });
  }

  function renderProfile() {
    setNav("我的", false);
    setTab("profile");
    var profile = QinqingStore.profile();
    var interests = QinqingStore.interests();
    var mine = QinqingStore.myListings();
    app.innerHTML =
      '<div class="profile-head"><div class="avatar">' + (profile.name || "访").slice(0, 1) + "</div>" +
        "<div><div style=\"font-size:18px;font-weight:700\">" + profile.name + "</div>" +
        '<div style="opacity:.85;font-size:13px;margin-top:4px">' + (profile.phone || "尚未完善联系方式") + "</div></div></div>" +
      '<div class="stats" style="padding:12px 16px 0">' +
        '<div class="stat"><b>' + interests.length + "</b><small>购买意向</small></div>" +
        '<div class="stat"><b>' + mine.length + "</b><small>在售房源</small></div>" +
        '<div class="stat"><b>' + QinqingStore.listings().length + "</b><small>社区房源</small></div>" +
      "</div>" +
      '<div class="menu">' +
        '<a class="menu-item" href="#/my-interests">我的购买意向<span>' + interests.length + " 条 ›</span></a>" +
        '<a class="menu-item" href="#/my-listings">我发布的房源<span>' + mine.length + " 套 ›</span></a>" +
        '<a class="menu-item" href="#/interest">去登记意向<span>›</span></a>' +
        '<a class="menu-item" href="#/publish">发布出售<span>›</span></a>' +
      "</div>" +
      '<section class="section"><div class="project-box">置业顾问热线 ' + QINQING_SEED.project.hotline +
        "<br>本演示数据保存在本机浏览器，刷新不会丢失。</div></section>";
  }

  function renderMyInterests() {
    setNav("我的购买意向", true);
    setTab("profile");
    var list = QinqingStore.interests();
    app.innerHTML = '<section class="section"><div class="card-list">' +
      (list.length ? list.map(function (item) {
        return '<div class="interest-card"><h4>' + item.listingTitle + "</h4>" +
          '<div class="meta" style="margin-top:6px">' + item.name + " · " + item.phone + " · 户型 " + item.layout +
          (item.budget ? " · 预算 " + item.budget + "万" : "") + "</div>" +
          (item.note ? '<p class="prose" style="margin-top:8px">' + item.note + "</p>" : "") +
          '<div class="row-actions"><button class="btn btn-ghost btn-sm" data-del="' + item.id + '">删除</button></div></div>';
      }).join("") : '<div class="empty"><strong>还没有意向登记</strong>去房源详情页即可提交</div>') +
      "</div></section>";
    app.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        QinqingStore.removeInterest(btn.getAttribute("data-del"));
        toast("已删除");
        renderMyInterests();
      });
    });
  }

  function renderMyListings() {
    setNav("我发布的房源", true);
    setTab("profile");
    var list = QinqingStore.myListings();
    app.innerHTML = '<section class="section"><div class="card-list">' +
      (list.length ? list.map(function (item) {
        return '<div class="mine-card"><h4>' + item.title + "</h4>" +
          '<div class="meta" style="margin-top:6px">' + item.rooms + " · " + item.area + "㎡ · " + fmtPrice(item.price) + "万</div>" +
          '<div class="row-actions">' +
            '<a class="btn btn-ghost btn-sm" href="#/listing?id=' + encodeURIComponent(item.id) + '" style="display:flex;align-items:center">查看</a>' +
            '<button class="btn btn-ghost btn-sm" data-del="' + item.id + '">下架</button>' +
          "</div></div>";
      }).join("") : '<div class="empty"><strong>还没有发布房源</strong>点击底部「发布」即可出售</div>') +
      "</div></section>";
    app.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        QinqingStore.removeListing(btn.getAttribute("data-del"));
        toast("已下架");
        renderMyListings();
      });
    });
  }

  function render() {
    var route = parseHash();
    var views = {
      "/": renderHome,
      "/listings": renderListings,
      "/listing": renderDetail,
      "/interest": renderInterest,
      "/publish": renderPublish,
      "/profile": renderProfile,
      "/my-interests": renderMyInterests,
      "/my-listings": renderMyListings
    };
    var view = views[route.path] || renderHome;
    view(route.query);
    app.scrollTop = 0;
    document.querySelector(".app-scroll").scrollTop = 0;
  }

  navBack.addEventListener("click", function () {
    if (history.length > 1) history.back();
    else go("/");
  });

  document.getElementById("tabs").addEventListener("click", function (e) {
    var item = e.target.closest(".tab-item");
    if (!item) return;
    var map = { home: "/", listings: "/listings", publish: "/publish", profile: "/profile" };
    go(map[item.getAttribute("data-tab")]);
  });

  document.body.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-go]");
    if (btn) go(btn.getAttribute("data-go"));
  });

  window.addEventListener("hashchange", render);
  render();
})();

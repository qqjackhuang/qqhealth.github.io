(function () {
  var root = document.getElementById('app');
  var toastEl;

  function state() { return QinqingStore.load(); }

  function greeting() {
    var h = new Date().getHours();
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }

  function toast(text) {
    toastEl.textContent = text;
    toastEl.style.display = 'block';
    setTimeout(function () { toastEl.style.display = 'none'; }, 1600);
  }

  function parseHash() {
    var raw = (location.hash || '#/home').replace(/^#/, '');
    var parts = raw.split('/').filter(Boolean);
    return { name: parts[0] || 'home', id: parts[1] || '' };
  }

  function go(path) {
    location.hash = path;
  }

  function statusText(s) {
    return s === 'confirmed' ? '已确认' : s === 'done' ? '已完成' : '待确认';
  }

  function nav(title, showBack) {
    return '<div class="nav">' +
      (showBack ? '<button class="back" data-go="back">‹</button>' : '') +
      '<h1>' + title + '</h1></div>';
  }

  function tabbar(active) {
    var items = [
      ['home', '首页'],
      ['health', '健康'],
      ['family', '亲情'],
      ['service', '服务'],
      ['mine', '我的']
    ];
    return '<nav class="tabbar">' + items.map(function (it) {
      return '<a href="#/' + it[0] + '" class="' + (active === it[0] ? 'active' : '') + '"><span class="ico">●</span>' + it[1] + '</a>';
    }).join('') + '</nav>';
  }

  function shell(title, body, tab, back) {
    var s = state();
    return nav(title, !!back) +
      '<div class="main ' + (s.largeFont ? 'large' : '') + '">' + body + '</div>' +
      (tab ? tabbar(tab) : '') +
      '<div class="toast" id="toast"></div>';
  }

  function viewHome() {
    var s = state();
    var who = s.role === 'elder' ? s.elder.name : s.user.family.name;
    var notices = s.notices.map(function (n) {
      return '<div class="list" data-go="#/notice/' + n.id + '"><div class="row"><span class="tag ' + (n.tag === '健康' ? 'green' : '') + '">' + n.tag + '</span><span class="muted">' + n.time + '</span></div><div class="title">' + n.title + '</div><div class="muted">' + n.summary + '</div></div>';
    }).join('');
    var tags = s.elder.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    var body =
      '<div class="card"><div class="muted">' + s.community.name + '</div><div class="hello">' + greeting() + '，' + who + '</div><div>' + s.elder.name + ' · ' + s.elder.room + '</div><div style="margin-top:8px">' + tags + '</div></div>' +
      '<div class="card"><div class="grid4">' +
        '<div class="quick" data-go="#/visit"><div class="ico">访</div>预约探望</div>' +
        '<div class="quick" data-go="#/record"><div class="ico">记</div>记健康</div>' +
        '<div class="quick" data-go="#/message"><div class="ico">信</div>亲情留言</div>' +
        '<div class="quick" data-action="sos"><div class="ico sos">急</div>紧急呼叫</div>' +
      '</div></div>' +
      '<div class="card"><div class="section"><span class="t">今日健康</span><span class="link" data-go="#/health">查看趋势</span></div><div class="grid3">' +
        '<div class="metric" data-go="#/health"><div class="muted">血压</div><div class="num">' + s.healthLatest.bp.high + '/' + s.healthLatest.bp.low + '</div><div class="muted">' + s.healthLatest.bp.time + '</div></div>' +
        '<div class="metric" data-go="#/health"><div class="muted">血糖</div><div class="num">' + s.healthLatest.glucose.value + '</div><div class="muted">' + s.healthLatest.glucose.time + '</div></div>' +
        '<div class="metric" data-go="#/health"><div class="muted">心率</div><div class="num">' + s.healthLatest.heart.value + '</div><div class="muted">' + s.healthLatest.heart.time + '</div></div>' +
      '</div></div>' +
      '<div class="card"><div class="section"><span class="t">今日膳食</span><span class="muted">' + s.meals.date + '</span></div>' +
        '<div class="meal"><b>早</b>' + s.meals.breakfast.join('、') + '</div>' +
        '<div class="meal"><b>午</b>' + s.meals.lunch.join('、') + '</div>' +
        '<div class="meal"><b>晚</b>' + s.meals.dinner.join('、') + '</div></div>' +
      '<div class="card"><div class="section"><span class="t">公寓通知</span></div>' + notices + '</div>' +
      '<div class="card steward" data-action="call-steward"><div><div class="t">联系管家 · ' + s.community.steward + '</div><div class="muted">' + s.community.stewardPhone + ' · 24 小时值班</div></div><div class="call">拨打</div></div>';
    return shell('亲情公寓', body, 'home');
  }

  function viewHealth() {
    var s = state();
    var meds = s.medications.map(function (m) {
      return '<div class="list row" data-action="med" data-id="' + m.id + '"><div><div class="name">' + m.name + ' · ' + m.dose + '</div><div class="muted">' + m.when + '</div></div><span class="tag ' + (m.taken ? 'green' : 'warn') + '">' + (m.taken ? '已服' : '未服') + '</span></div>';
    }).join('');
    var recs = s.healthRecords.map(function (r) {
      return '<div class="list"><div class="row"><span class="name">' + r.label + '</span><span class="tag ' + (r.status === 'warn' ? 'warn' : 'green') + '">' + (r.status === 'warn' ? '关注' : '正常') + '</span></div><div class="row"><span>' + r.value + ' ' + r.unit + '</span><span class="muted">' + r.time + '</span></div></div>';
    }).join('');
    var body =
      '<div class="card"><div class="section"><span class="t">' + s.elder.name + ' 的健康摘要</span><button class="btn mini" data-go="#/record">记一笔</button></div><div class="grid2">' +
        '<div class="metric"><div class="muted">血压 mmHg</div><div class="num">' + s.healthLatest.bp.high + '/' + s.healthLatest.bp.low + '</div></div>' +
        '<div class="metric"><div class="muted">血糖 mmol/L</div><div class="num">' + s.healthLatest.glucose.value + '</div></div>' +
        '<div class="metric"><div class="muted">心率</div><div class="num">' + s.healthLatest.heart.value + '</div></div>' +
        '<div class="metric"><div class="muted">体重 kg</div><div class="num">' + s.healthLatest.weight.value + '</div></div>' +
      '</div></div>' +
      '<div class="card"><div class="section"><span class="t">今日用药</span></div>' + meds + '</div>' +
      '<div class="card"><div class="section"><span class="t">最近记录</span></div>' + recs + '</div>';
    return shell('健康档案', body, 'health');
  }

  function viewRecord() {
    var body =
      '<div class="card"><label>记录类型</label><select id="type"><option value="bp">血压 · mmHg</option><option value="glucose">血糖 · mmol/L</option><option value="heart">心率 · 次/分</option><option value="weight">体重 · kg</option></select>' +
      '<label>数值</label><input id="value" placeholder="血压请写成 128/78">' +
      '<label>备注（可选）</label><input id="note" placeholder="如：早餐前">' +
      '<div style="height:12px"></div><button class="btn" data-action="save-health">保存到健康档案</button></div>' +
      '<div class="muted tip">血压超过 140/90 或血糖超出 3.9–7.0 会标记为「关注」。</div>';
    return shell('记一笔健康', body, '', true);
  }

  function viewFamily() {
    var s = state();
    var members = s.familyMembers.map(function (m) {
      return '<div class="list row"><div><div class="name">' + m.name + ' · ' + m.relation + (m.primary ? ' <span class="tag">紧急联系人</span>' : '') + '</div><div class="muted">' + m.city + ' · 最近探望 ' + m.lastVisit + '</div></div><span class="link">' + m.phone + '</span></div>';
    }).join('');
    var visits = s.visits.map(function (v) {
      return '<div class="list"><div class="row"><span class="name">' + v.who + '</span><span class="tag ' + (v.status === 'confirmed' ? 'green' : '') + '">' + statusText(v.status) + '</span></div><div class="muted">' + v.date + ' ' + v.time + ' · ' + v.note + '</div></div>';
    }).join('');
    var body =
      '<div class="card item"><div><div class="t">家庭邀请码</div><div class="hello">' + s.inviteCode + '</div><div class="muted">发给家人即可加入 ' + s.elder.name + ' 的亲情圈</div></div><button class="btn mini" data-go="#/bind">去绑定</button></div>' +
      '<div class="card"><div class="section"><span class="t">家人</span></div>' + members + '</div>' +
      '<div class="card"><div class="section"><span class="t">探望安排</span><span class="link" data-go="#/visit">预约</span></div>' + visits + '</div>' +
      '<button class="btn" data-go="#/message">打开亲情留言板</button>';
    return shell('亲情圈', body, 'family');
  }

  function viewBind() {
    var body = '<div class="card"><label>请输入家庭邀请码</label><input id="code" placeholder="例如 QQ-8821"><div style="height:12px"></div><button class="btn" data-action="bind">确认绑定</button></div><div class="muted tip">演示邀请码：QQ-8821</div>';
    return shell('绑定家人', body, '', true);
  }

  function viewMessage() {
    var s = state();
    var msgs = s.messages.map(function (m) {
      return '<div class="card msg"><div class="row"><span class="name">' + m.from + '</span><span class="muted">' + m.time + '</span></div><div class="muted">' + m.role + '</div><div class="body">' + m.text + '</div></div>';
    }).join('');
    var body = msgs + '<div class="composer"><input id="msg" placeholder="给家人留一句话"><button class="btn" data-action="send">发送</button></div>';
    return shell('亲情留言板', body, '', true);
  }

  function viewVisit() {
    var s = state();
    var who = s.role === 'elder' ? '家属' : s.user.family.name;
    var body = '<div class="card"><label>探望日期</label><input id="date" type="date" value="2026-08-16"><label>到达时间</label><input id="time" type="time" value="14:00"><label>探望人</label><input id="who" value="' + who + '"><label>备注</label><input id="note" placeholder="人数、是否用餐"><div style="height:12px"></div><button class="btn" data-action="save-visit">提交预约</button></div><div class="muted tip">前台会在预约时段引导入户。数据保存在本机。</div>';
    return shell('预约探望', body, '', true);
  }

  function viewService() {
    var s = state();
    var items = s.services.map(function (it) {
      return '<div class="card item" data-go="#/service/' + it.id + '"><div><div class="name">' + it.name + '</div><div class="muted">' + it.desc + '</div></div><div class="price">' + it.price + '</div></div>';
    }).join('');
    var acts = s.activities.map(function (a) {
      return '<div class="list row" data-action="activity" data-id="' + a.id + '"><div><div class="name">' + a.name + '</div><div class="muted">' + a.when + ' · ' + a.place + '</div></div><span class="tag ' + (a.joined ? 'green' : '') + '">' + (a.joined ? '已报名' : '报名') + '</span></div>';
    }).join('');
    var books = s.bookings.length ? '<div class="card"><div class="section"><span class="t">我的预约</span></div>' + s.bookings.map(function (b) {
      return '<div class="list"><div class="row"><span class="name">' + b.name + '</span><span class="tag">待确认</span></div><div class="muted">' + b.when + ' · ' + b.note + '</div></div>';
    }).join('') + '</div>' : '';
    return shell('公寓服务', items + '<div class="card"><div class="section"><span class="t">本周活动</span></div>' + acts + '</div>' + books, 'service');
  }

  function viewServiceDetail(id) {
    if (id === 's1') {
      go('/visit');
      return viewVisit();
    }
    var s = state();
    var service = s.services.find(function (x) { return x.id === id; }) || s.services[0];
    var body = '<div class="card"><div class="hello">' + service.name + '</div><div class="muted">' + service.desc + '</div><div class="price" style="margin-top:8px">' + service.price + ' · ' + service.duration + '</div></div>' +
      '<div class="card"><label>希望时间</label><input id="when" value="今天下午"><label>说明</label><textarea id="note" placeholder="饮食禁忌、行动协助等"></textarea><div style="height:12px"></div><button class="btn" data-action="book" data-id="' + service.id + '">提交预约</button></div>';
    return shell('预约服务', body, '', true);
  }

  function viewNotice(id) {
    var s = state();
    var n = s.notices.find(function (x) { return x.id === id; }) || s.notices[0];
    var body = '<div class="card"><span class="tag">' + n.tag + '</span><div class="hello">' + n.title + '</div><div class="muted">' + n.time + '</div><p>' + n.content + '</p></div>';
    return shell('通知详情', body, '', true);
  }

  function viewMine() {
    var s = state();
    var name = s.role === 'elder' ? s.elder.name : s.user.family.name;
    var role = s.role === 'elder' ? '住户（长辈）' : '家属 · ' + s.user.family.relation;
    var body =
      '<div class="card profile"><div class="avatar big">' + (s.role === 'elder' ? '住' : '家') + '</div><div><div class="hello" style="font-size:20px">' + name + '</div><div class="muted">当前身份：' + role + '</div></div></div>' +
      '<div class="card"><div class="list row"><span>房间</span><span>' + s.elder.room + '</span></div><div class="list row"><span>入住日期</span><span>' + s.elder.checkIn + '</span></div><div class="list row"><span>公寓总机</span><span class="link">' + s.community.phone + '</span></div><div class="list row"><span>地址</span><span class="muted">' + s.community.address + '</span></div></div>' +
      '<div class="card"><div class="list row" data-action="role"><span>切换体验身份</span><span class="link">' + (s.role === 'elder' ? '切到家属' : '切到住户') + '</span></div><div class="list row" data-action="font"><span>适老化大字</span><span class="link">' + (s.largeFont ? '已开启' : '已关闭') + '</span></div><div class="list row" data-action="reset"><span>恢复演示数据</span><span class="muted">本地</span></div></div>' +
      '<div class="muted center">亲情公寓演示版 · 数据保存在本机，尚未连接真实后端</div>';
    return shell('我的', body, 'mine');
  }

  function render() {
    var route = parseHash();
    var html = '';
    if (route.name === 'health') html = viewHealth();
    else if (route.name === 'record') html = viewRecord();
    else if (route.name === 'family') html = viewFamily();
    else if (route.name === 'bind') html = viewBind();
    else if (route.name === 'message') html = viewMessage();
    else if (route.name === 'visit') html = viewVisit();
    else if (route.name === 'service' && route.id) html = viewServiceDetail(route.id);
    else if (route.name === 'service') html = viewService();
    else if (route.name === 'notice') html = viewNotice(route.id);
    else if (route.name === 'mine') html = viewMine();
    else html = viewHome();
    root.innerHTML = html;
    toastEl = document.getElementById('toast');
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go], [data-action], .back');
    if (!t) return;
    if (t.dataset.go === 'back' || t.classList.contains('back')) {
      history.back();
      return;
    }
    if (t.dataset.go) {
      go(t.dataset.go.replace(/^#/, ''));
      return;
    }
    var action = t.dataset.action;
    if (action === 'sos') {
      toast('已通知值班室与紧急联系人');
    } else if (action === 'call-steward') {
      toast('演示环境：请拨打 ' + state().community.stewardPhone);
    } else if (action === 'med') {
      QinqingStore.toggleMed(t.dataset.id);
      render();
    } else if (action === 'activity') {
      QinqingStore.toggleActivity(t.dataset.id);
      render();
    } else if (action === 'save-health') {
      var type = val('type');
      var value = val('value').trim();
      var meta = { bp: ['血压', 'mmHg'], glucose: ['血糖', 'mmol/L'], heart: ['心率', '次/分'], weight: ['体重', 'kg'] }[type];
      if (!value) { toast('请填写数值'); return; }
      var status = 'normal';
      if (type === 'bp') {
        var parts = value.split(/[/／]/);
        if (!Number(parts[0]) || !Number(parts[1])) { toast('血压请写成 128/78'); return; }
        if (Number(parts[0]) >= 140 || Number(parts[1]) >= 90) status = 'warn';
      } else {
        var n = Number(value);
        if (!n) { toast('请输入数字'); return; }
        if (type === 'glucose' && (n >= 7 || n <= 3.9)) status = 'warn';
        if (type === 'heart' && (n >= 100 || n <= 50)) status = 'warn';
      }
      QinqingStore.addHealthRecord({ type: type, label: meta[0], value: value, unit: meta[1], status: status, note: val('note') });
      toast('已记入档案');
      setTimeout(function () { go('/health'); }, 400);
    } else if (action === 'bind') {
      if (val('code').trim().toUpperCase() !== state().inviteCode) { toast('邀请码不正确'); return; }
      QinqingStore.update(function (s) { s.bound = true; });
      toast('已加入亲情圈');
      setTimeout(function () { go('/family'); }, 400);
    } else if (action === 'send') {
      var text = val('msg').trim();
      if (!text) return;
      QinqingStore.addMessage(text, state().role);
      render();
    } else if (action === 'save-visit') {
      if (!val('who').trim()) { toast('请填写探望人'); return; }
      QinqingStore.addVisit({ date: val('date'), time: val('time'), who: val('who'), note: val('note') || '探望' });
      toast('已提交预约');
      setTimeout(function () { go('/family'); }, 400);
    } else if (action === 'book') {
      QinqingStore.addBooking(t.dataset.id, val('when') || '待定', val('note') || '无备注');
      toast('预约已提交');
      setTimeout(function () { go('/service'); }, 400);
    } else if (action === 'role') {
      QinqingStore.update(function (s) { s.role = s.role === 'elder' ? 'family' : 'elder'; });
      toast('已切换身份');
      render();
    } else if (action === 'font') {
      QinqingStore.update(function (s) { s.largeFont = !s.largeFont; });
      render();
    } else if (action === 'reset') {
      QinqingStore.reset();
      toast('已恢复演示数据');
      render();
    }
  });

  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/home';
  render();
})();

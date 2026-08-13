(function (global) {
  var KEY = 'qinqing_apartment_state_v1';

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultState() {
    return Object.assign({ role: 'family', largeFont: false, bound: true }, clone(global.QINQING_SEED));
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {}
    var state = defaultState();
    save(state);
    return state;
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function update(mutator) {
    var state = load();
    mutator(state);
    save(state);
    return state;
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function nowText() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  global.QinqingStore = {
    load: load,
    save: save,
    update: update,
    reset: function () {
      var state = defaultState();
      save(state);
      return state;
    },
    addHealthRecord: function (payload) {
      return update(function (state) {
        var item = Object.assign({ id: 'h' + Date.now(), time: nowText(), status: payload.status || 'normal' }, payload);
        state.healthRecords.unshift(item);
        if (payload.type === 'bp') {
          var parts = String(payload.value).split('/');
          state.healthLatest.bp = { high: Number(parts[0]), low: Number(parts[1]), time: '刚刚', status: item.status };
        } else if (payload.type === 'glucose') {
          state.healthLatest.glucose = { value: Number(payload.value), time: '刚刚', status: item.status };
        } else if (payload.type === 'heart') {
          state.healthLatest.heart = { value: Number(payload.value), time: '刚刚', status: item.status };
        } else if (payload.type === 'weight') {
          state.healthLatest.weight = { value: Number(payload.value), time: '刚刚', status: item.status };
        }
      });
    },
    addVisit: function (payload) {
      return update(function (state) {
        state.visits.unshift(Object.assign({ id: 'v' + Date.now(), status: 'pending' }, payload));
      });
    },
    addMessage: function (text, role) {
      return update(function (state) {
        var from = role === 'elder' ? state.elder.name : state.user.family.name;
        var who = role === 'elder' ? '住户' : state.user.family.relation;
        state.messages.push({ id: 'msg' + Date.now(), from: from, role: who, text: text, time: '刚刚' });
      });
    },
    addBooking: function (serviceId, when, note) {
      return update(function (state) {
        var service = state.services.find(function (s) { return s.id === serviceId; });
        state.bookings.unshift({
          id: 'b' + Date.now(),
          serviceId: serviceId,
          name: service ? service.name : '服务',
          when: when,
          note: note,
          status: 'pending'
        });
      });
    },
    toggleActivity: function (id) {
      return update(function (state) {
        var item = state.activities.find(function (a) { return a.id === id; });
        if (item) item.joined = !item.joined;
      });
    },
    toggleMed: function (id) {
      return update(function (state) {
        var item = state.medications.find(function (m) { return m.id === id; });
        if (item) item.taken = !item.taken;
      });
    }
  };
})(window);

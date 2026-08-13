const { seed } = require('./data')

const KEY = 'qinqing_apartment_state_v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function defaultState() {
  return {
    role: 'family',
    largeFont: false,
    bound: true,
    ...clone(seed)
  }
}

function load() {
  try {
    const raw = wx.getStorageSync(KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('load store failed', err)
  }
  const state = defaultState()
  save(state)
  return state
}

function save(state) {
  wx.setStorageSync(KEY, JSON.stringify(state))
}

function update(mutator) {
  const state = load()
  mutator(state)
  save(state)
  return state
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function nowText() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function addHealthRecord(payload) {
  return update((state) => {
    const item = {
      id: 'h' + Date.now(),
      time: nowText(),
      status: payload.status || 'normal',
      ...payload
    }
    state.healthRecords.unshift(item)
    if (payload.type === 'bp') {
      const parts = String(payload.value).split('/')
      state.healthLatest.bp = {
        high: Number(parts[0]),
        low: Number(parts[1]),
        time: '刚刚',
        status: item.status
      }
    } else if (payload.type === 'glucose') {
      state.healthLatest.glucose = { value: Number(payload.value), time: '刚刚', status: item.status }
    } else if (payload.type === 'heart') {
      state.healthLatest.heart = { value: Number(payload.value), time: '刚刚', status: item.status }
    } else if (payload.type === 'weight') {
      state.healthLatest.weight = { value: Number(payload.value), time: '刚刚', status: item.status }
    }
  })
}

function addVisit(payload) {
  return update((state) => {
    state.visits.unshift({
      id: 'v' + Date.now(),
      status: 'pending',
      ...payload
    })
  })
}

function addMessage(text, role) {
  return update((state) => {
    const from = role === 'elder' ? state.elder.name : state.user.family.name
    const who = role === 'elder' ? '住户' : state.user.family.relation
    state.messages.push({
      id: 'msg' + Date.now(),
      from,
      role: who,
      text,
      time: '刚刚'
    })
  })
}

function addBooking(serviceId, when, note) {
  return update((state) => {
    const service = state.services.find((s) => s.id === serviceId)
    state.bookings.unshift({
      id: 'b' + Date.now(),
      serviceId,
      name: service ? service.name : '服务',
      when,
      note,
      status: 'pending'
    })
  })
}

function toggleActivity(id) {
  return update((state) => {
    const item = state.activities.find((a) => a.id === id)
    if (item) item.joined = !item.joined
  })
}

function toggleMed(id) {
  return update((state) => {
    const item = state.medications.find((m) => m.id === id)
    if (item) item.taken = !item.taken
  })
}

function reset() {
  const state = defaultState()
  save(state)
  return state
}

module.exports = {
  load,
  save,
  update,
  addHealthRecord,
  addVisit,
  addMessage,
  addBooking,
  toggleActivity,
  toggleMed,
  reset
}

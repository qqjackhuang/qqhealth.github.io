const store = require('../../utils/store')

const TYPES = [
  { type: 'bp', label: '血压', unit: 'mmHg', hint: '如 128/78' },
  { type: 'glucose', label: '血糖', unit: 'mmol/L', hint: '如 6.1' },
  { type: 'heart', label: '心率', unit: '次/分', hint: '如 72' },
  { type: 'weight', label: '体重', unit: 'kg', hint: '如 54.2' }
]

Page({
  data: {
    types: TYPES,
    index: 0,
    value: '',
    note: ''
  },
  onType(e) {
    this.setData({ index: Number(e.detail.value), value: '' })
  },
  onValue(e) {
    this.setData({ value: e.detail.value })
  },
  onNote(e) {
    this.setData({ note: e.detail.value })
  },
  submit() {
    const meta = TYPES[this.data.index]
    const value = (this.data.value || '').trim()
    if (!value) {
      wx.showToast({ title: '请填写数值', icon: 'none' })
      return
    }
    let status = 'normal'
    if (meta.type === 'bp') {
      const parts = value.split(/[/／]/)
      const high = Number(parts[0])
      const low = Number(parts[1])
      if (!high || !low) {
        wx.showToast({ title: '血压请写成 128/78', icon: 'none' })
        return
      }
      if (high >= 140 || low >= 90) status = 'warn'
    } else {
      const n = Number(value)
      if (!n) {
        wx.showToast({ title: '请输入数字', icon: 'none' })
        return
      }
      if (meta.type === 'glucose' && (n >= 7.0 || n <= 3.9)) status = 'warn'
      if (meta.type === 'heart' && (n >= 100 || n <= 50)) status = 'warn'
    }
    store.addHealthRecord({
      type: meta.type,
      label: meta.label,
      value,
      unit: meta.unit,
      status,
      note: this.data.note
    })
    wx.showToast({ title: '已记入档案', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  }
})

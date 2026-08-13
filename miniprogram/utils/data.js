/** 亲情公寓演示数据。接入后端时，用接口返回替换 seed。 */
const seed = {
  inviteCode: 'QQ-8821',
  community: {
    name: '亲情公寓 · 桂花园',
    address: '广州市天河区亲情路 88 号',
    phone: '020-8888 1202',
    steward: '陈管家',
    stewardPhone: '138 0000 1202'
  },
  elder: {
    id: 'elder-01',
    name: '张桂兰',
    age: 78,
    gender: '女',
    room: '3 号楼 1202',
    bed: 'A 床',
    checkIn: '2024-03-18',
    tags: ['自理', '低盐饮食', '晨练']
  },
  user: {
    family: { name: '李婷', relation: '女儿', phone: '139 0000 7788' },
    elder: { name: '张桂兰', relation: '住户', phone: '137 0000 1202' }
  },
  familyMembers: [
    { id: 'f1', name: '李婷', relation: '女儿', phone: '139 0000 7788', city: '广州', primary: true, lastVisit: '2026-08-10' },
    { id: 'f2', name: '李强', relation: '儿子', phone: '137 0000 6611', city: '深圳', primary: false, lastVisit: '2026-07-26' },
    { id: 'f3', name: '王小雨', relation: '外孙女', phone: '158 0000 3344', city: '广州', primary: false, lastVisit: '2026-08-03' }
  ],
  healthLatest: {
    bp: { high: 128, low: 78, time: '今天 07:20', status: 'normal' },
    glucose: { value: 6.1, time: '今天 07:35', status: 'normal' },
    heart: { value: 72, time: '今天 07:20', status: 'normal' },
    weight: { value: 54.2, time: '昨天', status: 'normal' },
    sleep: { value: 7.2, time: '昨夜', status: 'normal' }
  },
  healthRecords: [
    { id: 'h1', type: 'bp', label: '血压', value: '128 / 78', unit: 'mmHg', time: '2026-08-13 07:20', status: 'normal' },
    { id: 'h2', type: 'glucose', label: '血糖', value: '6.1', unit: 'mmol/L', time: '2026-08-13 07:35', status: 'normal' },
    { id: 'h3', type: 'heart', label: '心率', value: '72', unit: '次/分', time: '2026-08-13 07:20', status: 'normal' },
    { id: 'h4', type: 'bp', label: '血压', value: '132 / 80', unit: 'mmHg', time: '2026-08-12 07:18', status: 'normal' },
    { id: 'h5', type: 'weight', label: '体重', value: '54.2', unit: 'kg', time: '2026-08-12 08:00', status: 'normal' },
    { id: 'h6', type: 'bp', label: '血压', value: '141 / 88', unit: 'mmHg', time: '2026-08-10 19:40', status: 'warn' }
  ],
  medications: [
    { id: 'm1', name: '氨氯地平', dose: '5mg', when: '早餐后', taken: true },
    { id: 'm2', name: '阿司匹林', dose: '100mg', when: '早餐后', taken: true },
    { id: 'm3', name: '钙尔奇', dose: '1 片', when: '晚餐后', taken: false }
  ],
  notices: [
    {
      id: 'n1',
      title: '周五包饺子亲情活动',
      time: '08-13 09:10',
      tag: '活动',
      summary: '本周五下午 3 点一楼活动室包饺子，家属可一同参加。',
      content: '桂花园将于本周五（8 月 15 日）15:00–17:00 在 1 楼活动室举办「包饺子·话家常」亲情活动。住户与家属均可报名，现场提供食材与围裙。请穿着防滑鞋，活动后可把饺子带回家。'
    },
    {
      id: 'n2',
      title: '季度免费体检通知',
      time: '08-12 16:40',
      tag: '健康',
      summary: '8 月 20 日上午体检，含血压、血糖、心电图。',
      content: '本季度免费体检安排在 8 月 20 日 08:30–11:00，地点：公寓医务室。项目包括血压、空腹血糖、心电图、常规问诊。请体检前一晚 22:00 后勿进食，可少量饮水。如需家属陪同，请提前在小程序预约探望。'
    },
    {
      id: 'n3',
      title: '3 号楼周四上午临时停水',
      time: '08-11 11:02',
      tag: '物业',
      summary: '8 月 14 日 09:00–11:30 维修水管，请提前储水。',
      content: '因 3 号楼供水主管道检修，8 月 14 日 09:00–11:30 将临时停水。请住户提前储水。热水壶与应急用水可向楼层服务员领取。给您带来不便，敬请谅解。'
    }
  ],
  meals: {
    date: '今天 · 8 月 13 日',
    breakfast: ['小米粥', '蒸蛋', '拌黄瓜'],
    lunch: ['番茄牛腩', '清炒时蔬', '米饭'],
    dinner: ['清蒸鲈鱼', '冬瓜汤', '南瓜']
  },
  visits: [
    { id: 'v1', date: '2026-08-16', time: '14:00–16:00', who: '李婷', status: 'confirmed', note: '带水果和照片' },
    { id: 'v2', date: '2026-08-10', time: '10:00–11:30', who: '李婷', status: 'done', note: '陪散步' }
  ],
  messages: [
    { id: 'msg1', from: '李婷', role: '女儿', text: '妈，周五我来包饺子，想吃您包的韭菜馅。', time: '昨天 20:18' },
    { id: 'msg2', from: '张桂兰', role: '住户', text: '好，我让厨房留点韭菜。你们路上慢一点。', time: '昨天 20:26' },
    { id: 'msg3', from: '李强', role: '儿子', text: '体检那天我请半天假陪您。', time: '今天 08:02' }
  ],
  services: [
    { id: 's1', name: '预约探望', desc: '登记探访时间，前台引导入户', price: '免费', duration: '需提前 2 小时', category: 'family', icon: 'visit' },
    { id: 's2', name: '营养配餐', desc: '按医嘱调整低盐低糖餐', price: '18 元/餐起', duration: '当日 10:00 前', category: 'life', icon: 'meal' },
    { id: 's3', name: '房间打扫', desc: '更换床单、通风除尘', price: '40 元/次', duration: '约 40 分钟', category: 'life', icon: 'clean' },
    { id: 's4', name: '陪诊就医', desc: '管家陪同往返社区医院', price: '80 元/次', duration: '约 3 小时', category: 'care', icon: 'hospital' },
    { id: 's5', name: '康复护理', desc: '血压监测与关节活动操', price: '60 元/次', duration: '约 45 分钟', category: 'care', icon: 'nurse' },
    { id: 's6', name: '兴趣活动', desc: '书法、合唱、园艺报名', price: '免费', duration: '每周固定', category: 'activity', icon: 'activity' }
  ],
  bookings: [],
  activities: [
    { id: 'a1', name: '晨间太极', when: '每天 07:00', place: '中庭花园', joined: true },
    { id: 'a2', name: '包饺子亲情会', when: '周五 15:00', place: '1 楼活动室', joined: false },
    { id: 'a3', name: '老电影放映', when: '周六 19:30', place: '多功能厅', joined: false }
  ]
}

module.exports = { seed }

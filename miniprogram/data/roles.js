(function (root, factory) {
  var exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  } else {
    root.QINQING_ROLES = exported.roles;
    root.QINQING_ROLE_BY_ID = exported.roleById;
    root.QINQING_CMS_META = exported.meta;
    root.QINQING_CMS_SEED = exported.seed;
    root.QINQING_SUMMARIZE = exported.summarize;
  }
})(typeof window !== "undefined" ? window : this, function () {
  var roles = [
    {
      id: "steward",
      title: "亲情管家",
      subtitle: "小区店主",
      eyebrow: "STEWARD",
      desc: "驻守小区，把邻里的买菜、陪诊、代收接住",
      cta: "申请成为管家",
      banner: "banner-steward.jpg",
      page: "join/steward.html",
      accent: "#2c5f4f",
      summaryKeys: ["community", "storeType"],
      intro:
        "面向小区便利店、物业驿站、快递点和热心店主。入驻后可承接本小区亲情服务订单，成为邻里第一入口。",
      fields: [
        { name: "name", label: "姓名", type: "text", required: true, maxlength: 10, placeholder: "怎么称呼您" },
        { name: "phone", label: "手机号", type: "tel", required: true, maxlength: 11, placeholder: "11 位手机号" },
        { name: "city", label: "所在城市", type: "text", required: true, maxlength: 20, placeholder: "例如 上海" },
        { name: "community", label: "小区名称", type: "text", required: true, maxlength: 30, placeholder: "您服务的小区" },
        { name: "address", label: "小区 / 店面地址", type: "text", required: true, placeholder: "路名门牌或楼栋位置" },
        {
          name: "storeType",
          label: "店面类型",
          type: "select",
          required: true,
          options: ["便利店", "物业驿站", "快递点", "社区食堂", "个人兼职"]
        },
        { name: "storeName", label: "店面名称", type: "text", required: true, maxlength: 20, placeholder: "例如 桂花便利" },
        {
          name: "services",
          label: "可提供的服务",
          type: "checks",
          required: true,
          options: ["代收快递", "买菜跑腿", "陪诊挂号", "家政对接", "药品代购", "邻里互助"]
        },
        { name: "hours", label: "营业 / 可服务时间", type: "text", placeholder: "例如 7:00–22:00" },
        { name: "intro", label: "自我介绍", type: "textarea", placeholder: "在本小区做了多久、熟悉哪些楼栋、能为邻居做什么" }
      ]
    },
    {
      id: "provider",
      title: "服务商",
      subtitle: "机构或个人",
      eyebrow: "PROVIDER",
      desc: "家政、陪诊、维修等专业能力接入社区",
      cta: "入驻成为服务商",
      banner: "banner-provider.jpg",
      page: "join/provider.html",
      accent: "#c45c26",
      summaryKeys: ["identity", "category"],
      intro:
        "机构与持证个人均可申请。审核通过后，由亲情管家按小区派单，服务记录进入同一入驻集合。",
      fields: [
        {
          name: "identity",
          label: "身份类型",
          type: "select",
          required: true,
          options: ["机构", "个人"]
        },
        { name: "name", label: "机构名称或姓名", type: "text", required: true, maxlength: 30, placeholder: "营业执照名称或本人姓名" },
        { name: "phone", label: "联系电话", type: "tel", required: true, maxlength: 11, placeholder: "11 位手机号" },
        { name: "city", label: "所在城市", type: "text", required: true, placeholder: "例如 北京" },
        {
          name: "category",
          label: "服务类目",
          type: "select",
          required: true,
          options: ["家政保洁", "医疗护理 / 陪诊", "维修安装", "餐饮配送", "教育培训", "适老化改造"]
        },
        { name: "area", label: "服务区域", type: "text", required: true, placeholder: "例如 东城区及相邻小区" },
        {
          name: "years",
          label: "从业年限",
          type: "select",
          required: true,
          options: ["1 年以内", "1–3 年", "3–5 年", "5 年以上"]
        },
        { name: "qualification", label: "资质与证照", type: "textarea", placeholder: "营业执照、护理证、健康证等，可先文字说明" },
        { name: "intro", label: "服务介绍", type: "textarea", required: true, placeholder: "擅长项目、收费方式、能否上门、可服务时段" }
      ]
    },
    {
      id: "partner",
      title: "亲友合伙买房",
      subtitle: "拼份额、一起住",
      eyebrow: "PARTNER",
      desc: "亲戚朋友一起出资，降低首付门槛",
      cta: "登记合伙意向",
      banner: "banner-partner.jpg",
      page: "join/partner.html",
      accent: "#b4531e",
      summaryKeys: ["targetCity", "budget"],
      intro:
        "适合亲友共同持有或接力居住。本页只收集意向，不构成投资承诺；后续由顾问协助沟通份额与退出约定。",
      fields: [
        { name: "name", label: "姓名", type: "text", required: true, maxlength: 10, placeholder: "怎么称呼您" },
        { name: "phone", label: "手机号", type: "tel", required: true, maxlength: 11, placeholder: "11 位手机号" },
        { name: "city", label: "现居城市", type: "text", required: true, placeholder: "您现在住在哪" },
        { name: "targetCity", label: "意向城市 / 板块", type: "text", required: true, placeholder: "例如 上海 · 东区亲情社区" },
        { name: "budget", label: "可出资预算（万元）", type: "number", required: true, placeholder: "您计划投入的金额" },
        {
          name: "partners",
          label: "计划合伙人数",
          type: "select",
          required: true,
          options: ["2 人", "3 人", "4 人及以上", "希望平台匹配"]
        },
        {
          name: "relation",
          label: "与合伙人关系",
          type: "select",
          required: true,
          options: ["直系亲属", "亲戚", "朋友", "同事", "待匹配"]
        },
        {
          name: "contribution",
          label: "出资方式",
          type: "select",
          required: true,
          options: ["现金", "房产置换", "现金 + 房产", "尚未确定"]
        },
        {
          name: "layout",
          label: "期望户型",
          type: "select",
          options: ["两室", "三室", "四室亲情户型", "不限"]
        },
        { name: "note", label: "补充说明", type: "textarea", placeholder: "居住安排、是否需要长辈套房、退出预期等" }
      ]
    },
    {
      id: "publisher",
      title: "个人信息发布",
      subtitle: "邻里信息墙",
      eyebrow: "PUBLISHER",
      desc: "转让、互助、闲置、求职，发到社区",
      cta: "发布一条信息",
      banner: "banner-publisher.jpg",
      page: "join/publisher.html",
      accent: "#3d4c7a",
      summaryKeys: ["infoType", "title"],
      intro:
        "本社区住户可发布个人启事。内容进入同一入驻集合，角色记为「信息发布者」，审核后出现在邻里墙。",
      fields: [
        { name: "name", label: "姓名", type: "text", required: true, maxlength: 10, placeholder: "怎么称呼您" },
        { name: "phone", label: "联系电话", type: "tel", required: true, maxlength: 11, placeholder: "11 位手机号" },
        { name: "city", label: "所在城市", type: "text", required: true, placeholder: "例如 杭州" },
        {
          name: "infoType",
          label: "信息类型",
          type: "select",
          required: true,
          options: ["房源转让", "求租求购", "邻里互助", "二手闲置", "招聘求职", "其他"]
        },
        { name: "title", label: "标题", type: "text", required: true, maxlength: 30, placeholder: "一句话说明你要发布的事" },
        { name: "community", label: "所在小区 / 区域", type: "text", required: true, placeholder: "方便邻居辨认" },
        { name: "content", label: "详细内容", type: "textarea", required: true, placeholder: "时间、价格、条件、看房方式等" },
        {
          name: "validDays",
          label: "有效期",
          type: "select",
          required: true,
          options: ["7 天", "15 天", "30 天", "长期"]
        }
      ]
    }
  ];

  var seed = [
    {
      id: "seed-steward-1",
      role: "steward",
      status: "approved",
      name: "王丽",
      phone: "13800001111",
      city: "上海",
      createdAt: 1740000000000,
      fields: {
        name: "王丽",
        phone: "13800001111",
        city: "上海",
        community: "桂花园",
        address: "亲情社区 18 号 1 栋底商",
        storeType: "便利店",
        storeName: "桂花便利",
        services: ["代收快递", "买菜跑腿", "邻里互助"],
        hours: "7:00–22:00",
        intro: "在本小区开店 6 年，熟悉 1–8 栋住户。"
      }
    },
    {
      id: "seed-provider-1",
      role: "provider",
      status: "pending",
      name: "安心陪诊",
      phone: "13900002222",
      city: "上海",
      createdAt: 1740100000000,
      fields: {
        identity: "机构",
        name: "安心陪诊",
        phone: "13900002222",
        city: "上海",
        category: "医疗护理 / 陪诊",
        area: "东区及相邻街道",
        years: "3–5 年",
        qualification: "营业执照、护理员证 4 人",
        intro: "医院陪诊、取报告、代配药，可与小区管家对接。"
      }
    },
    {
      id: "seed-partner-1",
      role: "partner",
      status: "pending",
      name: "刘洋",
      phone: "13700003333",
      city: "杭州",
      createdAt: 1740200000000,
      fields: {
        name: "刘洋",
        phone: "13700003333",
        city: "杭州",
        targetCity: "上海 · 东区",
        budget: "180",
        partners: "3 人",
        relation: "亲戚",
        contribution: "现金",
        layout: "四室亲情户型",
        note: "希望长辈套房相对独立，周末共同居住。"
      }
    },
    {
      id: "seed-publisher-1",
      role: "publisher",
      status: "approved",
      name: "赵敏",
      phone: "13600004444",
      city: "上海",
      createdAt: 1740300000000,
      fields: {
        name: "赵敏",
        phone: "13600004444",
        city: "上海",
        infoType: "邻里互助",
        title: "本周六绘本角找两位陪读志愿者",
        community: "桂花园",
        content: "儿童绘本角活动 10:00–11:30，需要两位家长或住户一起陪读。",
        validDays: "7 天"
      }
    }
  ];

  function roleById(id) {
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].id === id) return roles[i];
    }
    return null;
  }

  function summarize(doc) {
    var role = roleById(doc.role);
    if (!role) return doc.name || "";
    var parts = [];
    (role.summaryKeys || []).forEach(function (key) {
      var value = (doc.fields || {})[key];
      if (Array.isArray(value)) value = value.join("、");
      if (value) parts.push(String(value));
    });
    return parts.join(" · ") || doc.name || "";
  }

  return {
    roles: roles,
    roleById: roleById,
    summarize: summarize,
    seed: seed,
    meta: {
      collection: "role_applications",
      collectionTitle: "入驻申请",
      collectionHint: "四个入口提交的数据都写入这一条集合，用角色字段区分。",
      statuses: [
        { id: "pending", label: "待审核" },
        { id: "approved", label: "已通过" },
        { id: "rejected", label: "已驳回" }
      ]
    }
  };
});

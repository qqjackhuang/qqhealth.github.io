# 亲情公寓小程序

给公寓住户（长辈）和家属准备的协同小程序原型。本仓库原先只有 MDN 练习页，这次补齐了可运行的产品骨架。

## 现在能做什么

- **首页**：问候、房间信息、今日健康、膳食、通知、紧急呼叫、联系管家
- **健康**：血压 / 血糖 / 心率 / 体重记录，用药打卡，异常标记为「关注」
- **亲情**：家人列表、邀请码 `QQ-8821` 绑定、探望预约、留言板
- **服务**：配餐、打扫、陪诊、护理、活动报名
- **我的**：住户 / 家属身份切换、适老化大字、恢复演示数据

数据先存在本机（微信 `Storage` / 网页 `localStorage`），方便先把流程跑通，再接后端。

## 两种打开方式

### 1. 网页演示（GitHub Pages）

打开仓库根目录的 `index.html`，或进入 `preview/`。合并后可访问：

- 介绍页：`https://qqjackhuang.github.io/`
- 手机演示：`https://qqjackhuang.github.io/preview/`

### 2. 微信开发者工具（正式小程序工程）

**必须导入 `miniprogram/` 这一层**，不要选仓库根目录。根目录没有 `app.json`，工具会导入失败或当成空项目。

1. 安装并打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，用微信扫码登录。
2. 先拿到带小程序代码的分支（当前还在 PR 里，未合入 `main`）：

   ```bash
   git clone -b cursor/qinqing-apartment-miniprogram-9142 https://github.com/qqjackhuang/qqhealth.github.io.git
   ```

   或在 GitHub 打开 [PR #1](https://github.com/qqjackhuang/qqhealth.github.io/pull/1)，用 Code → Download ZIP。
3. 工具首页点 **「+」→ 导入项目**，按下面填写：

   | 项 | 填什么 |
   |---|---|
   | 项目目录 | `…/qqhealth.github.io/miniprogram` |
   | AppID | 勾选 **使用测试号**（还没有正式小程序账号时） |
   | 项目名称 | 亲情公寓 |
   | 开发模式 | 小程序 |

4. 点「导入」。模拟器应出现首页「亲情公寓 · 桂花园」。
5. 若提示 AppID 无效：项目详情 → 本地设置 → 勾选「不校验合法域名」；AppID 可继续用测试号。正式发布前再到[微信公众平台](https://mp.weixin.qq.com/)申请小程序，把 `miniprogram/project.config.json` 里的 `touristappid` 换成你的 AppID。

## 目录

```
miniprogram/     微信原生小程序（WXML / WXSS / JS）
preview/         同等功能的 H5 演示，方便没有开发者工具时点看
index.html       GitHub Pages 介绍页
test-site/       原有学习练习页，未改动
```

## 建议的后续完善顺序

1. **账号与登录**：注册小程序，替换 `touristappid`，用 `wx.login` 换 openid。
2. **同一份数据**：上云开发或自建 API，家属和住户看到同一位长辈的档案。
3. **真实业务**：订阅消息（用药、停水、探望确认）、支付（配餐/护理）、视频通话。
4. **适老化**：再放大点击热区、语音播报通知、一键 SOS 对接值班室电话。
5. **健康设备**：血压计 / 手环通过蓝牙或厂商开放平台写入档案。

原 `test-site/` 练习内容保留，不影响小程序开发。

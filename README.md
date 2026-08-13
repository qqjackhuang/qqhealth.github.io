# 和悦亲情公寓小程序

面向多代同堂家庭的社区房产小程序，覆盖三条主路径：

1. **房源展示**：项目介绍、户型筛选、房源详情
2. **购买意向登记**：针对某一套房或项目整体提交回访信息
3. **个人出售房源发布**：业主发布二手房，自动出现在房源列表并标注「业主转让」

演示数据保存在本机（浏览器 `localStorage` / 微信 `Storage`），无需后端即可完整体验。

## 在线预览（H5）

仓库根目录是可直接打开的移动端 H5，桌面浏览器会以手机外框展示。

- 本地：用浏览器打开 `index.html`，或在仓库根目录执行 `python3 -m http.server 8080`
- GitHub Pages：推送到默认分支后访问对应 Pages 地址

## 微信小程序

用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入 `miniprogram/` 目录：

1. 选择「导入项目」
2. 目录选本仓库的 `miniprogram`
3. AppID 可先用测试号 / `touristappid`
4. 编译即可预览首页、房源、发布、我的四个 Tab

上线前把 `miniprogram/project.config.json` 里的 `appid` 换成正式账号，并按需接入真实后端与登录。

## 功能说明

| 模块 | 能力 |
| --- | --- |
| 首页 | 项目卖点、热门房源、置业热线 |
| 房源 | 搜索、户型筛选、项目房 / 业主转让 |
| 详情 | 价格面积朝向、户型说明、跳转意向登记 |
| 意向登记 | 姓名手机校验、预算与联系时段、记录可在「我的」查看 |
| 发布出售 | 户型面积售价、封面图、联系人；发布后进入列表 |
| 我的 | 意向列表、在售房源下架 |

## 目录

```
index.html                 H5 入口
assets/                    H5 样式、脚本、图片
miniprogram/               微信原生小程序
scripts/generate-images.py 封面与 Tab 图标生成
```

项目名称、文案和示例房源可在 `assets/js/data.js` 与 `miniprogram/data/listings.js` 中修改。

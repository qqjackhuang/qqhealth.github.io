# 亲情管家小程序

面向社区的亲情公寓 + 多角色入驻平台。首页四张轮播图分别进入四个收集网页：

| 轮播 | 角色 | 收集页 |
| --- | --- | --- |
| 亲情管家 | 小区店主 | `join/steward.html` |
| 服务商 | 机构或个人 | `join/provider.html` |
| 亲友合伙买房 | 拼份额购房 | `join/partner.html` |
| 个人信息发布 | 邻里信息墙 | `join/publisher.html` |

四个页面收集的字段不同，提交后都写入 CMS **同一个集合** `role_applications`（入驻申请），用 `role` 区分。后台可以把某条记录改派给其他角色。

## 如何预览

- **H5 小程序**：打开根目录 `index.html`（桌面端是手机外框）
- **四个收集页**：`join/index.html`
- **CMS 后台**：`cms/index.html`（可按角色筛选、分配角色、通过/驳回、导出 JSON）
- **微信开发者工具**：导入 `miniprogram/` 目录，不要选仓库根目录

本地可在仓库根目录执行：

```bash
python3 -m http.server 8080
```

然后打开 `http://127.0.0.1:8080/`。

## 如何上传已经开发好的小程序

分两件事：**传到 GitHub 仓库**，和 **传到微信后台**。

### 1. 把本仓库里的工程导入微信开发者工具

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，微信扫码登录。
2. 把本仓库拉到电脑（含本分支）：

   ```bash
   git clone -b cursor/role-banners-cms-8c43 https://github.com/qqjackhuang/qqhealth.github.io.git
   ```

   或在 GitHub 下载 ZIP。
3. 工具首页点 **「+」→ 导入项目**：

   | 项 | 填什么 |
   | --- | --- |
   | 项目目录 | `…/qqhealth.github.io/miniprogram` |
   | AppID | 勾选 **使用测试号**（还没有正式账号时） |
   | 项目名称 | 亲情管家 |
   | 开发模式 | 小程序 |

4. 点导入。模拟器应出现首页四张角色轮播。
5. 若提示域名或 AppID：详情 → 本地设置 → 勾选「不校验合法域名、web-view、TLS 版本」。

### 2. 你电脑上已经有一个开发差不多的小程序，要并进本仓库

微信开发者工具 **没有「导入 GitHub」按钮**。请把本地目录放进 Git：

1. 在开发者工具右上角 **详情 → 本地设置 / 项目配置**，记下「项目目录」。
2. 把那个目录里的 `app.js`、`app.json`、`pages/` 等，复制到本仓库的 `miniprogram/`（先备份本仓库现有文件）。
3. 用 GitHub Desktop，或在仓库根目录执行：

   ```bash
   git add miniprogram
   git commit -m "同步本地已开发的小程序"
   git push
   ```

不要把项目建在仓库根目录：根目录是 GitHub Pages / H5，小程序必须在 `miniprogram/` 里，且该层有 `app.json`。

### 3. 上传到微信（预览给别人扫、或提交审核）

1. 打开 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序，拿到 AppID。
2. 把 `miniprogram/project.config.json` 里的 `appid` 从 `touristappid` 改成你的 AppID。
3. 开发者工具右上角 **上传**，填版本号和备注。
4. 登录公众平台 → 版本管理：
   - **选为体验版**：生成体验版二维码，把体验者微信号加到成员里即可扫码。
   - **提交审核 → 发布**：正式上线。

未认证的个人小程序，部分类目（房产交易等）可能无法过审，可先作为体验版给内部使用。

演示数据存在本机（`localStorage` / 微信 Storage），换设备不会同步。上线后把 `QinqingCMS.add` 换成你们的云开发集合或自建 API 即可，字段结构已经按「一个集合 + role」设计。

## 目录

```
index.html                 H5 小程序入口（含角色轮播）
join/                      四个角色收集网页
cms/                       CMS 后台（集合 role_applications）
assets/                    H5 样式、脚本、图片
miniprogram/               微信原生小程序
scripts/                   检查脚本与图片生成
```

集合字段：`id`、`role`（steward / provider / partner / publisher）、`status`、`name`、`phone`、`city`、`fields`（各角色自己的表单）、`createdAt`。

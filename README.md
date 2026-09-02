# 亲情管家 · qqgj

微信小程序（**腾讯云开发**）。本仓库已清空旧练习页和演示稿，只收你电脑上那份正式工程。

## 需要拷进来的文件

微信开发者工具 → 右上角 **详情 → 本地设置** → 打开「项目目录」，把下面这些放进本仓库根目录：

```
project.config.json
miniprogram/
cloudfunctions/
```

不要带 `node_modules/`、`miniprogram_npm/`。

## 怎么上传

开发者工具 **不能** 直接连 GitHub，任选一种：

1. **GitHub Desktop**：克隆本仓库 → 把上面三个拷进来 → Commit → Push
2. **命令行**：`git clone` 后复制文件，再 `git add` / `commit` / `push`
3. **发压缩包到 Cursor 对话**：去掉 `node_modules` 后打 zip，发到这个对话，由代理写入仓库

拷完后，开发者工具的「项目目录」选仓库根（有 `project.config.json` 的那一层）。云开发环境不用改，仍用原来的环境 ID。

代码进仓库后回复「已上传」，再继续优化现有云开发工程。

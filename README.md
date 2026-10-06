# 文理食堂 · 好好吃饭指南

这是一个无需安装依赖、无需构建的静态网站。直接发布本文件夹中的文件即可。

## 本地预览

双击 `index.html`，或将它拖入浏览器。

## 发布到公开网址（GitHub Pages）

1. 登录 [GitHub](https://github.com/) 并新建一个仓库。
2. 在仓库页面点 **Add file → Upload files**，把本文件夹内的 `index.html`、`style.css`、`script.js`、`favicon.svg` 上传到仓库根目录，再点 **Commit changes**。
3. 打开仓库 **Settings → Pages**。
4. 在 **Build and deployment** 中将 Source 设为 **Deploy from a branch**，选择 `main` 和 `/(root)`，然后保存。
5. 等待 Pages 页面显示网站地址，复制 `https://用户名.github.io/仓库名/` 并用手机打开。

官方说明：[配置 GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

也可以把仓库导入 Vercel：在 Vercel 选 **Add New → Project**、导入 GitHub 仓库并点击 **Deploy**。该项目没有构建步骤。

## 说明

- 页面适配手机、平板和电脑，手机底部导航会自动显示。
- 学生评价仅保存在当前浏览器设备中，不会在不同同学之间同步。
- 食堂介绍、菜品和评分是演示内容，发布前建议按学校实际情况更新 `index.html`。
- Google Fonts 仅用于字体美化；网络不可用时页面会使用设备自带字体。





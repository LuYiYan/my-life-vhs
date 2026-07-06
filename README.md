# 我的生活录像带

一个复古 VHS 风格的个人博客，用纯 HTML / CSS / JavaScript 构建。

## 本地预览

直接用浏览器打开 `index.html` 即可。

## 添加文章

编辑 `js/posts.js`，在 `POSTS` 数组里添加新对象：

```js
{
  id: 4,
  title: "文章标题",
  date: "2026-07-06",
  tags: ["标签"],
  excerpt: "摘要文字",
  content: `<p>正文 HTML</p>`
}
```

## 自定义动态效果

- `css/style.css` — 样式与 CSS 动画（扫描线、故障效果、卡片动画等）
- `js/main.js` — 交互逻辑（时间码、滚动动画、VHS 噪点等）

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库（例如 `my-life-vhs`）
2. 推送代码后，进入仓库 **Settings → Pages**
3. Source 选择 **Deploy from a branch**，Branch 选 `main`，文件夹选 `/ (root)`
4. 保存后几分钟即可通过 `https://你的用户名.github.io/my-life-vhs/` 访问

## 技术栈

- HTML5
- CSS3（动画、渐变、响应式）
- 原生 JavaScript（无构建工具依赖）

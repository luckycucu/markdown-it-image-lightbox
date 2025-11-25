<h1 align="center">markdown-it-image-lightbox</h1>
<p align="center">
<a href="README_EN.md">English</a>
</p>

markdown-it-image-lightbox 插件，可以让markdown-it渲染的 Markdown 图片具备**灯箱（Lightbox）功能**。

该插件能让渲染后的 Markdown 图片在点击时以全屏或弹窗形式放大显示。当页面布局限制了图片完整展示时，也能提供清晰的放大预览体验。

## 安装

```
npm install markdown-it-image-lightbox
```

## 使用

```js
import MarkdownIt from 'markdown-it';
import imageLightbox from 'markdown-it-image-lightbox';

const md =new MarkdownIt()

md.use(imageLightbox, {
  mode:1,                      // 灯箱样式
  lazyLoading: true,           // 启用懒加载
  enableLightbox: true,        // 启用灯箱功能
  imageClass: 'my-custom-class', // 设置正文图片的 CSS 类名
  imageRadius: '8px',          // 设置正文图片的圆角大小
  referrerpolicy: false,       // 是否设置 referrerpolicy="no-referrer"
  showCaption: true            // 是否显示图片标题（使用 alt 文本）
});

const result = md.render('![alt text](image.jpg)');

```

**配置选项**

| 选项               | 类型        | 默认值                                  | 说明                                                                                                                                     |
| ------------------ | ----------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| mode | number | 1 | 灯箱样式，目前存在两种样式。具体可以看样例。 |
| lazyLoading    | boolean | true                                | 是否启用图片懒加载，提升页面初始加载速度。                                                                                               |
| enableLightbox | boolean | true                                | 是否启用灯箱功能（点击放大）。                                                    |
| imageClass     | string  | "markdown-it-image-lightbox-plugin" | 设置正文图片的 CSS 类名，便于样式隔离或定制。                                                                       |
| imageRadius | string | "" | 设置正文图片的圆角大小，如 "10px"。 |
| referrerpolicy | boolean | false                              | 若为 `true`，则为 `<img>` 添加 `referrerpolicy="no-referrer"`，防止来源 URL 泄露，有助于绕过部分防盗链策略（请确保合法合规使用）。 |
| showCaption    | boolean | true                                | 是否在灯箱中显示图片标题（取自 Markdown 中的 `alt` 文本）。                                                                            |

## 样例

**mode=1，默认样式，灯箱中图片右上角存在关闭按钮，图片不会占满页面**

![1763907524300](image/README/1763907524300.png)

**mode=2，灯箱图片不存在关闭按钮，左击鼠标会关闭灯箱，图片会尽可能占满页面**

![image-20251125220520680](image\README\image-20251125220520680.png)

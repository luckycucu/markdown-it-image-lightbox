<h1 align="center">markdown-it-image-lightbox</h1>
<p align="center">
<a href="README_EN.md">English</a>
</p>

**markdown-it-image-lightbox** 是一款为 markdown-it 渲染的图片添加**灯箱（Lightbox）功能**的插件。启用后，用户点击 Markdown 图片即可在弹窗中全屏查看高清大图，有效解决因布局压缩导致的图像细节模糊、不可见问题。

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
  imageMaxWidth: "100vh",      // 设置正文图片的最大宽度
  imageMaxHeight: "70vh",      // 设置正文图片的最大高度
  showCaption: true            // 设置正文图片是否显示标题
  referrerpolicy: false,       // 是否设置 referrerpolicy="no-referrer"
});

const result = md.render('![alt text](image.jpg)');

```

**配置选项**

| 选项           | 类型    | 默认值                              | 说明                                                                                                                                     |
| -------------- | ------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| mode           | number  | 1                                   | 灯箱样式，目前存在两种样式。具体可以看样例。                                                                                             |
| lazyLoading    | boolean | true                                | 是否启用图片懒加载，提升页面初始加载速度。                                                                                               |
| enableLightbox | boolean | true                                | 是否启用灯箱功能（点击放大）。                                                                                                           |
| imageClass     | string  | "markdown-it-image-lightbox-plugin" | 设置正文图片的 CSS 类名，便于样式隔离或定制。                                                                                            |
| imageRadius    | string  | ""                                  | 设置正文图片的圆角大小，如 "10px"。                                                                                                      |
| imageMaxWidth  | string  | "100vh"                             | 设置正文图片的最大宽度，如"100vh", "500px"。                                                                                             |
| imageMaxHeight | string  | "60vh"                              | 设置正文图片的最大高度，如"60vh"，"600px"。                                                                                              |
| showCaption    | boolean | true                                | 设置正文图片是否显示标题（取自 Markdown 中的 `alt` 文本）。                                                                            |
| referrerpolicy | boolean | false                               | 若为 `true`，则为 `<img>` 添加 `referrerpolicy="no-referrer"`，防止来源 URL 泄露，有助于绕过部分防盗链策略（请确保合法合规使用）。 |

## 样例

**mode=1，默认样式，灯箱中图片右上角存在关闭按钮，图片不会占满页面**

![1763907524300](image/README/1763907524300.png)

**mode=2，灯箱图片不存在关闭按钮，左击鼠标会关闭灯箱，图片会尽可能占满页面**

![image-20251125220520680](image/README/image-20251125220520680.png)

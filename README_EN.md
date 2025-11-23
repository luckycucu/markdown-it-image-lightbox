# markdown-it-image-lightbox

The **markdown-it-image-lightbox** plugin adds **lightbox functionality** to images rendered by markdown-it.

With this plugin, Markdown images can be enlarged in a fullscreen or modal view when clicked. Even when page layout constraints prevent full-size image display, users still get a clear, zoomed-in preview experience.

## Installation

```
npm install markdown-it-image-lightbox
```

## Usage

```javascript
import MarkdownIt from 'markdown-it';
import imageLightbox from 'markdown-it-image-lightbox';

const md = MarkdownIt().use(imageLightbox, {
  lazyLoading: true,           // Enable lazy loading
  enableLightbox: true,        // Enable lightbox (click-to-zoom) functionality
  imageClass: 'my-custom-class', // Custom CSS class for images
  referrerpolicy: false,       // Whether to set referrerpolicy="no-referrer"
  showCaption: true            // Whether to display image captions (using alt text)
});

const result = md.render('![alt text](image.jpg)');
```

## Configuration Options

| Option             | Type        | Default                                 | Description                                                                                                                                                                                           |
| ------------------ | ----------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lazyLoading`    | `boolean` | `true`                                | Enables lazy loading to improve initial page load performance.                                                                                                                                        |
| `enableLightbox` | `boolean` | `true`                                | Enables the lightbox (click-to-enlarge) feature. Set to `false` to retain only other enhancements (e.g., lazy loading, custom class).                                                               |
| `imageClass`     | `string`  | `'markdown-it-image-lightbox-plugin'` | A custom CSS class applied to all images for styling isolation or customization.                                                                                                                      |
| `referrerpolicy` | `boolean` | `false`                               | If `true`, adds `referrerpolicy="no-referrer"` to `<img>` tags to prevent leaking the referring URL—helpful for bypassing certain hotlink protection mechanisms (use legally and responsibly). |
| `showCaption`    | `boolean` | `true`                                | Displays a caption in the lightbox using the image’s `alt` text from Markdown.                                                                                                                     |

## Example

![1763907524300](image/README/1763907524300.png)

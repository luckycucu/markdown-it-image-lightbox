# markdown-it-image-lightbox

**markdown-it-image-lightbox** is a plugin that adds **lightbox functionality** to images rendered by markdown-it. Once enabled, users can click on any Markdown image to view it in full-screen high resolution within a modal overlay, effectively addressing issues such as blurred or invisible image details caused by layout compression.

## Installation

```
npm install markdown-it-image-lightbox
```

## Usage

```javascript
import MarkdownIt from 'markdown-it';
import imageLightbox from 'markdown-it-image-lightbox';

const md = new MarkdownIt();

md.use(imageLightbox, {
  mode: 1,                      // Lightbox style
  lazyLoading: true,           // Enable lazy loading
  enableLightbox: true,        // Enable lightbox functionality
  imageClass: 'my-custom-class', // Set CSS class name for content images
  imageRadius: '8px',          // Set border radius for content images
  imageMaxWidth: "100vh",      // Set maximum width for content images
  imageMaxHeight: "70vh",      // Set maximum height for content images
  showCaption: true,           // Set whether to display captions for content images
  referrerpolicy: false,       // Whether to set referrerpolicy="no-referrer"
});

const result = md.render('![alt text](image.jpg)');
```

## Configuration Options

| Option         | Type    | Default Value                       | Description                                                                                                                                                                                      |
| -------------- | ------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mode           | number  | 1                                   | Lightbox style. Currently two styles are available. Refer to examples for details.                                                                                                               |
| lazyLoading    | boolean | true                                | Whether to enable image lazy loading to improve initial page load performance.                                                                                                                   |
| enableLightbox | boolean | true                                | Whether to enable lightbox functionality (click to zoom).                                                                                                                                        |
| imageClass     | string  | "markdown-it-image-lightbox-plugin" | Set CSS class name for content images to facilitate style isolation or customization.                                                                                                            |
| imageRadius    | string  | ""                                  | Set border radius for content images, e.g., "10px".                                                                                                                                              |
| imageMaxWidth  | string  | "100vh"                             | Set maximum width for content images, e.g., "100vh", "500px".                                                                                                                                    |
| imageMaxHeight | string  | "60vh"                              | Set maximum height for content images, e.g., "60vh", "600px".                                                                                                                                    |
| showCaption    | boolean | true                                | Set whether to display captions for content images (taken from the `alt` text in Markdown).                                                                                                    |
| referrerpolicy | boolean | false                               | If `true`, adds `referrerpolicy="no-referrer"` to `<img>` tags to prevent referrer URL leakage, which can help bypass some hotlink protection policies (ensure legal and compliant usage). |

## Example

**mode=1, default style. The lightbox has a close button in the upper right corner of the image, and the image does not fill the entire page.**

![1763907524300](image/README/1763907524300.png)

**mode=2. The lightbox does not have a close button; clicking the left mouse button closes the lightbox. The image will fill the page as much as possible.**

![image-20251125220520680](image/README/image-20251125220520680.png)

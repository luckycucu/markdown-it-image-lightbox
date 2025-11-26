class LightboxManager {
    constructor(options = {}) {
        this.lightbox = null;
        this.isInitialized = false;
        this.imageClass = options.imageClass || "markdown-it-image-lightbox-plugin";
        this.referrerpolicy = options.referrerpolicy || false;
        this.shadowRoot = null;
    }

    init() {
        if (this.isInitialized) return;
        // 创建 Shadow DOM 容器
        this.createShadowContainer();

        window.markdownImageClick = (imgElement) => {
            this.handleImageClick(imgElement);
        };

        this.isInitialized = true;
    }

    createShadowContainer() {
        // 创建宿主元素
        const shadowHost = document.createElement('div');
        shadowHost.id = `${this.imageClass}-shadow-host`;
        shadowHost.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(shadowHost);

        // 创建 Shadow Root
        this.shadowRoot = shadowHost.attachShadow({ mode: 'open' });

        // 注入样式到 Shadow DOM
        this.injectStylesToShadowDOM();
    }

    injectStylesToShadowDOM() {
        const styles = `
/* Markdown Lightbox 样式 */

.markdown-lightbox {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.8);
display: flex;
justify-content: center;
align-items: center;
z-index: 10000;
cursor: zoom-out;
pointer-events: auto;
}

.lightbox-backdrop {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.lightbox-content {
position: relative;
max-width: 100%;
max-height: 100%;
display: flex;
flex-direction: column;
align-items: center;
pointer-events: none;
}

.lightbox-image {
max-width: 100%;
max-height: 100vh;
object-fit: contain;
pointer-events: auto;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
animation: markdownImageScaleIn 0.3s ease;
}

/* SVG 图片特殊样式 */
.lightbox-image[src$=".svg" i] {
min-width: 200px;
min-height: 200px;
}

/* 图片悬停效果 */
.markdown-lightbox-plugin-image {
cursor: zoom-in !important;
max-width: 100% !important;
height: auto !important;
transition: transform 0.3s ease, box-shadow 0.3s ease !important;
border-radius: 4px !important;
}

.markdown-lightbox-plugin-image:hover {
transform: scale(1.02) !important;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .lightbox-content {
    max-width: 95% !important;
  }
}

/* 动画效果 */
@keyframes markdownLightboxFadeIn {
from {
  opacity: 0;
}
to {
  opacity: 1;
}
}

@keyframes markdownImageScaleIn {
from {
  opacity: 0;
  transform: scale(0.8);
}
to {
  opacity: 1;
  transform: scale(1);
}
}

.markdown-lightbox {
animation: markdownLightboxFadeIn 0.3s ease !important;
}
  `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        this.shadowRoot.appendChild(styleElement);
    }

    handleImageClick(imgElement) {
        // 获取图片容器，如果存在标题，则从容器中获取标题
        let alt = imgElement.getAttribute('data-alt');
        const src = imgElement.getAttribute('data-src');
        this.showLightbox(src, alt);
    }

    showLightbox(src, alt) {
        if (!this.shadowRoot) {
            this.createShadowContainer();
        }

        let lightbox = this.shadowRoot.querySelector('.markdown-lightbox');

        if (!lightbox) {
            lightbox = this.createLightbox(src, alt);
            this.shadowRoot.appendChild(lightbox);
            this.bindLightboxEvents(lightbox);
        } else {
            this.updateLightbox(lightbox, src, alt);
        }

        this.lightbox = lightbox;
        document.body.style.overflow = 'hidden';

        // 启用宿主元素的指针事件
        const shadowHost = document.getElementById(`${this.imageClass}-shadow-host`);
        if (shadowHost) {
            shadowHost.style.pointerEvents = 'auto';
        }
    }

    createLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'markdown-lightbox';

        // 检测是否为 SVG 图片
        const isSVG = this.isSVGImage(src);

        // 构建灯箱图片的HTML，包含referrerpolicy属性
        const referrerpolicyAttr = this.referrerpolicy ? 'referrerpolicy="no-referrer"' : '';

        // 为 SVG 添加特殊类
        const svgClass = isSVG ? ' lightbox-svg-image' : '';

        lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <img src="${src}" alt="${alt}" ${referrerpolicyAttr} class="lightbox-image${svgClass}">
    </div>
  `;
        return lightbox;
    }

    // 检测是否为 SVG 图片
    isSVGImage(src) {
        return src.toLowerCase().endsWith('.svg') ||
            src.startsWith('data:image/svg+xml');
    }

    bindLightboxEvents(lightbox) {
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const imageContent = lightbox.querySelector('.lightbox-content');

        const closeHandler = () => {
            this.hideLightbox();
        };

        backdrop.addEventListener('click', closeHandler);
        imageContent.addEventListener('click', closeHandler);

        // ESC 键关闭
        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideLightbox();
            }
        };

        document.addEventListener('keydown', keyHandler);
        this.currentKeyHandler = keyHandler;

        // SVG 图片加载后的特殊处理
        const img = lightbox.querySelector('.lightbox-image');
        if (this.isSVGImage(img.src)) {
            this.handleSVGImage(img);
        }
    }

    // 处理 SVG 图片
    handleSVGImage(imgElement) {
        // 确保 SVG 图片能够正确缩放
        imgElement.onload = () => {
            // 获取 SVG 的原始尺寸
            const svgWidth = imgElement.naturalWidth;
            const svgHeight = imgElement.naturalHeight;

            // 获取视口尺寸
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // 设置最大尺寸（基于视口高度）
            const maxWidth = viewportWidth * 1.0;  // 100vh， 受限於lightbox-content的寬度
            const maxHeight = viewportHeight * 1.0; // 85vh

            let targetWidth, targetHeight;

            if (svgWidth < 200 || svgHeight < 200) {
                // 小尺寸 SVG：按比例放大
                const aspectRatio = svgWidth / svgHeight;

                if (aspectRatio > 1) {
                    // 宽图
                    targetWidth = Math.max(maxWidth, svgWidth);
                    targetHeight = targetWidth / aspectRatio;
                    if (targetHeight > maxHeight) {
                        targetHeight = maxHeight;
                        targetWidth = targetHeight * aspectRatio;
                    }
                } else {
                    // 高图或方图
                    targetHeight = Math.max(maxHeight, svgHeight);
                    targetWidth = targetHeight * aspectRatio;
                    if (targetWidth > maxWidth) {
                        targetWidth = maxWidth;
                        targetHeight = targetWidth / aspectRatio;
                    }
                }

                // 转换为 vh 单位
                const targetWidthVH = (targetWidth / viewportHeight) * 100;
                const targetHeightVH = (targetHeight / viewportHeight) * 100;

                imgElement.style.width = `${targetWidthVH}vh`;
                imgElement.style.height = `${targetHeightVH}vh`;

            } else {
                // 正常尺寸 SVG：设置最大限制
                imgElement.style.maxWidth = '100vh';
                imgElement.style.maxHeight = '100vh';
                imgElement.style.width = 'auto';
                imgElement.style.height = 'auto';
            }

            // 添加 SVG 特定样式
            imgElement.style.background = 'white';
            imgElement.style.padding = '8px';
        };

        // 如果图片已经加载完成，立即执行处理
        if (imgElement.complete) {
            imgElement.onload();
        }
    }

    updateLightbox(lightbox, src, alt) {
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');

        img.src = src;
        img.alt = alt;

        // 更新时也设置referrerpolicy
        if (this.referrerpolicy) {
            img.setAttribute('referrerpolicy', 'no-referrer');
        } else {
            img.removeAttribute('referrerpolicy');
        }

        // 更新 SVG 相关样式
        if (this.isSVGImage(src)) {
            img.classList.add('lightbox-svg-image');
            this.handleSVGImage(img);
        } else {
            img.classList.remove('lightbox-svg-image');
            img.style.background = '';
            img.style.padding = '';
        }

        if (caption) {
            caption.textContent = alt || '';
        } else if (alt) {
            // 如果之前没有caption但现在有alt，创建caption
            const content = lightbox.querySelector('.lightbox-content');
            const newCaption = document.createElement('div');
            newCaption.className = 'lightbox-caption';
            newCaption.textContent = alt;
            content.appendChild(newCaption);
        }

        lightbox.style.display = 'flex';
    }

    hideLightbox() {
        if (this.lightbox) {
            this.lightbox.style.display = 'none';
        }

        // 移除键盘事件监听
        if (this.currentKeyHandler) {
            document.removeEventListener('keydown', this.currentKeyHandler);
            this.currentKeyHandler = null;
        }

        document.body.style.overflow = '';

        // 禁用宿主元素的指针事件
        const shadowHost = document.getElementById(`${this.imageClass}-shadow-host`);
        if (shadowHost) {
            shadowHost.style.pointerEvents = 'none';
        }
    }

    destroy() {
        const shadowHost = document.getElementById(`${this.imageClass}-shadow-host`);
        if (shadowHost) {
            shadowHost.remove();
        }

        // 移除键盘事件监听
        if (this.currentKeyHandler) {
            document.removeEventListener('keydown', this.currentKeyHandler);
            this.currentKeyHandler = null;
        }

        delete window.markdownImageClick;
        this.isInitialized = false;
        this.lightbox = null;
        this.shadowRoot = null;
    }
}

// 生成主文档的CSS样式（包含图片和标题样式）
const generateMainStyles = (
    imageClass = 'markdown-it-image-lightbox-plugin', 
    imageRadius = "", 
    imageMaxWidth= "", 
    imageMaxHeight= ""
) => {
    const styleId = `${imageClass}-main-styles`;

    if (typeof document === 'undefined' || document.getElementById(styleId)) return;
    if (imageRadius.length > 0) {
        imageRadius = `border-radius: ${imageRadius};`
    }
    if (imageMaxWidth.length > 0) {
        imageMaxWidth = `max-width: ${imageMaxWidth};`
    } else {
        imageMaxWidth = `max-width: 100vh;`
    }
    if (imageMaxHeight.length > 0) {
        imageMaxHeight = `max-height: ${imageMaxHeight};`
    } else {
        imageMaxHeight = `max-height: 60vh;`
    }
    const styles = `
/* 图片容器样式 */
.${imageClass}-container {
display: flex;
flex-direction: column;
align-items: center;
margin: 16px 0;
max-width: 100%;
}

/* 图片 */
.${imageClass} {
  cursor: zoom-in;
  ${imageMaxWidth}
  ${imageMaxHeight}
  height: auto;
  transition: all 0.3s ease;
  ${imageRadius}
  display: block;
  margin: 0 auto;
  filter: brightness(1); /* 使用滤镜替代缩放 */
}

.${imageClass}:hover {
  filter: brightness(1.05) !important; /* 亮度变化替代缩放 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* SVG 预览图特殊样式 */
.${imageClass}[src$=".svg" i] {
background: #f8f9fa;
padding: 5px;
border: 1px solid #e9ecef;
${imageRadius}
}

/* 图片标题样式 */
.${imageClass}-caption {
margin-top: 8px;
text-align: center;
color: #666;
font-size: 13px;
line-height: 1.4;
max-width: 80%;
opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 768px) {
.${imageClass}-caption {
  font-size: 12px;
  max-width: 90%;
}
  `;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
};

// 图片插件主函数
const mdImageLightboxMode2 =  (options = {}) => {
    const {
        lazyLoading = true,
        enableLightbox = true,
        imageClass = 'markdown-it-image-lightbox-plugin',
        referrerpolicy = false,
        showCaption = true,
        imageRadius = "",
        imageMaxWidth = "",
        imageMaxHeight = ""
    } = options;

    const lightboxManager = new LightboxManager({ imageClass, referrerpolicy });
    let isLightboxInitialized = false;

    const onErrorHandler = [
        "this.onerror=null;",
        "this.style.objectFit='contain';",
        "this.style.backgroundColor='#f9f9f9';",
        "this.style.opacity='0.7';",
        "this.alt='Failed to load image';"
    ].join('');

    return (md) => {
        // 在主文档中注入必要的图片样式
        if (typeof document !== 'undefined') {
            generateMainStyles(imageClass, imageRadius, imageMaxWidth, imageMaxHeight);
        }

        const defaultRender = md.renderer.rules.image;

        md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx];

            // 懒加载
            if (lazyLoading) {
                const loadingIndex = token.attrIndex('loading');
                if (loadingIndex < 0) {
                    token.attrs.push(['loading', 'lazy']);
                } else {
                    token.attrs[loadingIndex][1] = 'lazy';
                }
            }

            // referrerpolicy配置
            if (referrerpolicy) {
                const referrerpolicyIndex = token.attrIndex('referrerpolicy');
                if (referrerpolicyIndex < 0) {
                    token.attrs.push(['referrerpolicy', 'no-referrer']);
                } else {
                    token.attrs[referrerpolicyIndex][1] = 'no-referrer';
                }
            }

            // alt 属性
            const altIndex = token.attrIndex('alt');
            const altText = self.renderInlineAsText(token.children, options, env);
            token.attrs[altIndex][1] = altText;

            const src = token.attrGet('src');
            const alt = token.attrGet('alt');

            // 添加自定义类
            const imgClassIndex = token.attrIndex('class');
            const finalImageClass = imgClassIndex < 0 ?
                `${imageClass}` :
                `${token.attrs[imgClassIndex][1]} ${imageClass}`;

            if (imgClassIndex < 0) {
                token.attrs.push(['class', finalImageClass]);
            } else {
                token.attrs[imgClassIndex][1] = finalImageClass;
            }

            // 添加内联样式
            const styleIndex = token.attrIndex('style');
            if (styleIndex < 0) {
                token.attrs.push(['style', 'cursor: zoom-in;']);
            } else {
                const existingStyle = token.attrs[styleIndex][1];
                if (!existingStyle.includes('cursor')) {
                    token.attrs[styleIndex][1] = `${existingStyle}; cursor: zoom-in;`;
                }
            }

            // 灯箱支持属性
            if (enableLightbox) {
                token.attrs.push(['data-src', src]);
                token.attrs.push(['data-alt', alt]);
                token.attrs.push(['onclick', `window.markdownImageClick && window.markdownImageClick(this)`]);

                // 初始化灯箱
                if (!isLightboxInitialized) {
                    lightboxManager.init();
                    isLightboxInitialized = true;
                }
            }

            // 错误处理
            token.attrs.push(['onerror', onErrorHandler]);

            // 使用默认渲染获取图片HTML
            const imageHtml = defaultRender(tokens, idx, options, env, self);

            // 如果有标题且启用了标题显示，则包装在容器中并添加标题
            if (showCaption && altText && altText.trim() !== '') {
                return `
        <div class="${imageClass}-container">
          ${imageHtml}
          <div class="${imageClass}-caption">${altText}</div>
        </div>
      `;
            }

            return imageHtml;
        };

        // 提供清理方法
        md.imageLightbox = {
            destroy: () => {
                lightboxManager.destroy();
                isLightboxInitialized = false;
                // 移除主文档样式
                const styleElement = document.getElementById(`${imageClass}-main-styles`);
                if (styleElement) {
                    styleElement.remove();
                }
            },
            show: (src, alt) => lightboxManager.showLightbox(src, alt),
            hide: () => lightboxManager.hideLightbox(),
            // 获取 Shadow Root 的方法（用于调试）
            getShadowRoot: () => lightboxManager.shadowRoot
        };
    };
};

export default mdImageLightboxMode2;
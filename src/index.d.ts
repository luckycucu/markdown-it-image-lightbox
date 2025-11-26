// index.d.ts

declare module 'markdown-it-image-lightbox' {
  import MarkdownIt from 'markdown-it';

  interface PluginOptions {
    mode?: number;
    lazyLoading?: boolean;
    enableLightbox?: boolean;
    imageClass?: string;
    imageRadius?: string;
    imageMaxWidth?: string,
    imageMaxHeight?: string,
    referrerpolicy?: boolean;
    showCaption?: boolean;
  }

  function imageLightboxPlugin(md: MarkdownIt, options?: PluginOptions): void;

  export default imageLightboxPlugin;
}

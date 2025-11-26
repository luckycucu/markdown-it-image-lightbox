

import mdImageLightboxMode1 from "./lightbox1"
import mdImageLightboxMode2 from "./lightbox2"


export default function imageLightboxPlugin(md, options = {
    mode: 1,
    lazyLoading: true,
    enableLightbox: true,
    imageClass: "markdown-it-image-lightbox-plugin",
    imageRadius: "",
    imageMaxWidth: "",
    imageMaxHeight: "",
    referrerpolicy: false,
    showCaption: true
}) {
    if (options.mode === 1 || !options.mode) {
        const plugin = mdImageLightboxMode1(options);
        plugin(md);
    } else if (options.mode === 2) {
        const plugin = mdImageLightboxMode2(options);
        plugin(md);
    }
}

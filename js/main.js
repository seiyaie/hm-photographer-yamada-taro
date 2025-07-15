import { switchViewport } from "./utility/switch-viewport.js";
import { generalLightbox } from "./component/general-lightbox.js";
import { thumbnailGallery } from "./component/thumbnail-gallery.js";


switchViewport();
window.addEventListener("resize", switchViewport);



document.addEventListener("DOMContentLoaded", () => {
    thumbnailGallery();
    generalLightbox();
});

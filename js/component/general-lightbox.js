import { getSlideKeyframes, slideOptions, openCloseOptions, getOpenKeyframes, getCloseKeyframes } from "../utility/animations.js";

// top-works以外のlightbox
export const generalLightbox = () => {
    // query selectors
    const triggers = document.querySelectorAll(".js-lightbox-trigger");
    const lightboxContainer = document.querySelector(".js-lightbox");
    const lightboxImg = document.querySelector(".js-lightbox-img");
    const lightboxCloseBtn = lightboxContainer.querySelector(".js-lightbox-btn--close");
    const lightboxPrevBtn = lightboxContainer.querySelector(".js-lightbox-btn--prev");
    const lightboxNextBtn = lightboxContainer.querySelector(".js-lightbox-btn--next");

    let currentIndex = 0;
    let currentGallery = [];


    // functions
    // lightboxを開く処理
    const openLightbox = () => {
        const {img: openImgKeyframes, bg: openBgKeyframes } = getOpenKeyframes();
        const src = currentGallery[currentIndex].dataset.src;
        lightboxImg.src = src;
        lightboxImg.animate(openImgKeyframes, openCloseOptions);
        lightboxContainer.animate(openBgKeyframes, openCloseOptions);
        lightboxContainer.classList.add("is-active");
        document.body.style.overflow = "hidden";
        if (currentGallery.length <= 1) {
            hideArrows();
        } else {
            showArrows();
        }
    };

    // lightboxを閉じる処理
    const closeLightbox = () => {
        const {img: closeImgKeyframes, bg: closeBgKeyframes } = getCloseKeyframes();

        const closingAnim = lightboxImg.animate(closeImgKeyframes, openCloseOptions);
        lightboxContainer.animate(closeBgKeyframes, openCloseOptions);
        closingAnim.onfinish = () => {
            lightboxContainer.classList.remove("is-active");
            document.body.style.overflow = "";
        };
    };

    // lightbox内横移動の処理
    const slidesLightbox = (direction) => {
        const { closing, opening } = getSlideKeyframes(direction);

        const closingAnim = lightboxImg.animate(closing, slideOptions);
        closingAnim.onfinish = () => {
            const src = currentGallery[currentIndex].dataset.src;
            lightboxImg.src = src;
            lightboxImg.animate(opening, slideOptions);
        };
    };

    // lightbox内の矢印ボタン非表示関数
    const hideArrows = () => {
        lightboxPrevBtn.style.display = "none";
        lightboxNextBtn.style.display = "none";
    };

    // lightbox内の矢印ボタン表示関数
    const showArrows = () => {
        lightboxPrevBtn.style.display = "";
        lightboxNextBtn.style.display = "";
    };

    // event listener
    //画像クリックでlightbox表示
    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const galleryName = trigger.dataset.gallery;

            currentGallery = Array.from(document.querySelectorAll(`.js-lightbox-trigger[data-gallery="${galleryName}"]`));
            currentIndex = currentGallery.indexOf(trigger);

            openLightbox();
        });
    });

    // lightbox背景クリックで閉じる
    lightboxContainer.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            closeLightbox();
        }
    });

    // 閉じるボタン
    lightboxCloseBtn.addEventListener("click", () => {
        closeLightbox();
    });

    // 前へボタン
    lightboxPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        slidesLightbox("prev");
    });

    // 次へボタン
    lightboxNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentGallery.length;
        slidesLightbox("next");
    });

    // キーボード操作
    window.addEventListener("keydown", (e) => {
        if (!lightboxContainer.classList.contains("is-active")) return;
        // 左矢印キーで次の画像へ
        if (e.key === "ArrowLeft" && currentGallery.length > 1) {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            slidesLightbox("prev");
        }
        // 右矢印キーで次の画像へ
        if (e.key === "ArrowRight" && currentGallery.length > 1) {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            slidesLightbox("next");
        }
        // escキーでlightboxを閉じる
        if (e.key === "Escape") {
            closeLightbox();
        }
    });

    // モバイルスワイプ対応
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    });

    lightboxContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipeGesture();
    });

    const handleSwipeGesture = () => {
        if (currentGallery.length <= 1) return; // 1枚だけならスワイプ無効

        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50; // これ未満は無視（指が滑っただけ）

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0) {
            // 右スワイプ（→ prev）
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            slidesLightbox("prev");
        } else {
            // 左スワイプ（→ next）
            currentIndex = (currentIndex + 1) % currentGallery.length;
            slidesLightbox("next");
        }
    };
};

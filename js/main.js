/**
 * ビューポートの設定を切り替え
 * 画面の幅が380px未満の場合：ビューポートを380pxに固定
 * それ以上の場合：デバイスの幅に基づいてビューポートを設定
 */
const switchViewport = () => {
    // ビューポート要素を取得
    const viewportMeta = document.querySelector('meta[name="viewport"]');

    // 条件に基づいて適用するビューポートの設定を決定
    const viewportContent = window.outerWidth > 380 ? "width=device-width, initial-scale=1" : "width=380";

    // ビューポート要素が存在しない場合はreturn
    if (!viewportMeta) return;

    // 現在のビューポートの設定が目的の設定と異なる場合にのみ、新しい設定を適用します。
    if (viewportMeta.getAttribute("content") !== viewportContent) {
        viewportMeta.setAttribute("content", viewportContent);
    }
};
switchViewport();
window.addEventListener("resize", switchViewport);

// top-worksのサムネイルギャラリー関数
const thumbnailGallery = () => {
    // カルーセル用の要素を取得
    const selectedImage = document.querySelector(".js-top-works-selected-pic img");
    const galleryItems = [...document.querySelectorAll(".js-top-works-item img")];
    const prevBtn = document.querySelector(".js-prev");
    const nextBtn = document.querySelector(".js-next");

    // ライトボックス用の要素を所得
    const lightboxContainer = document.querySelector(".js-works-lightbox");
    const lightboxImg = lightboxContainer.querySelector(".js-works-lightbox-img");
    const lightboxPrevBtn = lightboxContainer.querySelector(".js-works-lightbox-btn--prev");
    const lightboxNextBtn = lightboxContainer.querySelector(".js-works-lightbox-btn--next");
    const lightboxCloseBtn = lightboxContainer.querySelector(".js-works-lightbox-btn--close");

    let activeIndex = 0;

    if (!selectedImage || !lightboxImg || !galleryItems.length) return;

    // スライドアニメーションのオプション
    const options = {
        duration: 200,
        easing: "ease-in-out",
    };

    // ライトボックス開閉アニメーションのオプション
    const lightboxAnimOptions = {
        duration: 300,
        easing: "ease-in-out",
    };

    // functions

    // 選択画像とアクティブサムネイルの更新処理（アニメ付き）
    const setActive = (index, direction, shouldScroll = true) => {
        //closing keyframes
        const closingKeyframes = {
            opacity: [1, 0],
            transform: direction === "next" ? ["translateX(0)", "translateX(-20px)"] : ["translateX(0)", "translateX(20px)"],
        };
        //opening keyframes
        const openingKeyframes = {
            opacity: [0, 1],
            transform: direction === "next" ? ["translateX(20px)", "translateX(0)"] : ["translateX(-20px)", "translateX(0)"],
        };

        const closingAnim = selectedImage.animate(closingKeyframes, options);

        closingAnim.onfinish = () => {
            activeIndex = index;
            selectedImage.src = galleryItems[index].src;
            selectedImage.animate(openingKeyframes, options);
            galleryItems.forEach((item, i) => {
                item.parentElement.classList.toggle("is-active", i === index);
            });
            if (shouldScroll) {
                galleryItems[index].scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest",
                });
            }
        };
    };

    // lightboxとカルーセルの同期関数（アニメーションなし）
    const setActiveInstant = (index, shouldScroll = true) => {
        activeIndex = index;
        selectedImage.src = galleryItems[index].src;
        galleryItems.forEach((item, i) => {
            item.parentElement.classList.toggle("is-active", i === index);
        });
        if (shouldScroll) {
            galleryItems[index].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }
    };

    // lightbox内の画像切り替え処理
    const lightboxCarousel = (index, direction) => {
        // closing keyframes
        const closingKeyframes = {
            opacity: [1, 0],
            transform: direction === "next" ? ["translateX(0)", "translateX(-60px)"] : ["translateX(0)", "translateX(60px)"],
        };

        // opening keyframes
        const openingKeyframes = {
            opacity: [0, 1],
            transform: direction === "next" ? ["translateX(60px)", "translateX(0)"] : ["translateX(-60px)", "translateX(0)"],
        };

        const closingAnim = lightboxImg.animate(closingKeyframes, options);
        closingAnim.onfinish = () => {
            const currentSrc = galleryItems[index].src;
            lightboxImg.src = currentSrc;
            lightboxImg.animate(openingKeyframes, options);
        };
    };

    // lightboxを開く処理
    const openLightbox = () => {
        // opening keyframes for lightbox
        const lightboxOpeningKeyframe = {
            transform: ["scale(0.5)", "scale(1.0)"],
            opacity: [0, 1],
        };
        const bgOpeningKeyframes = {
            opacity: [0, 1],
        };

        const currentSrc = galleryItems[activeIndex].src;
        lightboxImg.src = currentSrc;
        lightboxContainer.animate(bgOpeningKeyframes, lightboxAnimOptions);
        lightboxImg.animate(lightboxOpeningKeyframe, lightboxAnimOptions);
        lightboxContainer.classList.add("is-active");
    };

    // lightboxを閉じる処理
    const closeLightbox = () => {
        const closingLightboxKeyframes = {
            transform: ["scale(1)", "scale(0.5)"],
            opacity: [1, 0],
        };
        const bgClosingKeyframes = {
            opacity: [1, 0],
        };

        const closingAnim = lightboxImg.animate(closingLightboxKeyframes, lightboxAnimOptions);
        lightboxContainer.animate(bgClosingKeyframes, lightboxAnimOptions);
        closingAnim.onfinish = () => {
            lightboxContainer.classList.remove("is-active");
        };
    };

    // event listener
    // top-works-itemクリック時の処理
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (activeIndex === index) return;
            const direction = index > activeIndex ? "next" : "prev";
            setActive(index, direction);
        });
    });

    // 前の画像へ
    prevBtn.addEventListener("click", () => {
        const newIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
        setActive(newIndex, "prev");
    });

    // 次の画像へ
    nextBtn.addEventListener("click", () => {
        const newIndex = (activeIndex + 1) % galleryItems.length;
        setActive(newIndex, "next");
    });

    // 選択画像クリックでlightboxを開く
    selectedImage.addEventListener("click", () => openLightbox());

    // lightbox背景クリックで閉じる
    lightboxContainer.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            closeLightbox();
        }
    });

    // lightbox内の前へボタン
    lightboxPrevBtn.addEventListener("click", (e) => {
        const newIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxCarousel(newIndex, "prev");
        setActiveInstant(newIndex);
    });

    // lightbox内の次へボタン
    lightboxNextBtn.addEventListener("click", (e) => {
        const newIndex = (activeIndex + 1) % galleryItems.length;
        lightboxCarousel(newIndex, "next");
        setActiveInstant(newIndex);
    });

    // lightbox内の閉じるボタン
    lightboxCloseBtn.addEventListener("click", () => closeLightbox());

    // キーボード操作
    window.addEventListener("keydown", (e) => {
        if (!lightboxContainer.classList.contains("is-active")) return;
        // 左矢印キーで次の画像へ
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            const newIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
            lightboxCarousel(newIndex, "prev");
            setActiveInstant(newIndex);
        }
        // 右矢印キーで次の画像へ
        if (e.key === "ArrowRight") {
            e.preventDefault();
            const newIndex = (activeIndex + 1) % galleryItems.length;
            lightboxCarousel(newIndex, "next");
            setActiveInstant(newIndex);
        }
        // escキーでlightboxを閉じる
        if (e.key === "Escape") {
            closeLightbox();
        }
    });
    // 初期表示の設定
    setActive(0, null, false);
};

// top-works以外のlightbox
const generalLightbox = () => {
    // query selectors
    const triggers = document.querySelectorAll(".js-lightbox-trigger");
    const lightboxContainer = document.querySelector(".js-lightbox");
    const lightboxImg = document.querySelector(".js-lightbox-img");
    const lightboxCloseBtn = lightboxContainer.querySelector(".js-lightbox-btn--close");
    const lightboxPrevBtn = lightboxContainer.querySelector(".js-lightbox-btn--prev");
    const lightboxNextBtn = lightboxContainer.querySelector(".js-lightbox-btn--next");

    let currentIndex = 0;
    let currentGallery = [];

    //options keyframes
    // 開閉アニメーションのオプション
    const options = {
        duration: 300,
        easing: "ease-in-out",
    };

    // スライドアニメーションのオプション
    const slidesOptions = {
        duration: 200,
        easing: "ease-in-out",
    };

    // functions
    // lightboxを開く処理
    const openLightbox = () => {
        // opening keyframes for lightbox
        const lightboxOpeningKeyframe = {
            transform: ["scale(0.5)", "scale(1.0)"],
            opacity: [0, 1],
        };
        const bgOpeningKeyframes = {
            opacity: [0, 1],
        };

        const src = currentGallery[currentIndex].dataset.src;
        lightboxImg.src = src;
        lightboxImg.animate(lightboxOpeningKeyframe, options);
        lightboxContainer.animate(bgOpeningKeyframes, options);
        lightboxContainer.classList.add("is-active");
        if (currentGallery.length <= 1) {
            hideArrows();
        } else {
            showArrows();
        }
    };

    // lightboxを閉じる処理
    const closeLightbox = () => {
        const closingLightboxKeyframes = {
            transform: ["scale(1)", "scale(0.5)"],
            opacity: [1, 0],
        };
        const bgClosingKeyframes = {
            opacity: [1, 0],
        };

        const closingAnim = lightboxImg.animate(closingLightboxKeyframes, options);
        lightboxContainer.animate(bgClosingKeyframes, options);
        closingAnim.onfinish = () => {
            lightboxContainer.classList.remove("is-active");
        };
    };

    // lightbox内横移動の処理
    const slidesLightbox = (direction) => {
        const closingKeyframes = {
            opacity: [1, 0],
            transform: direction === "next" ? ["translateX(0)", "translateX(-60px)"] : ["translateX(0)", "translateX(60px)"],
        };

        const openingKeyframes = {
            opacity: [0, 1],
            transform: direction === "next" ? ["translateX(60px)", "translateX(0)"] : ["translateX(-60px)", "translateX(0)"],
        };

        const closingAnim = lightboxImg.animate(closingKeyframes, slidesOptions);
        closingAnim.onfinish = () => {
            const src = currentGallery[currentIndex].dataset.src;
            lightboxImg.src = src;
            lightboxImg.animate(openingKeyframes, slidesOptions);
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
        // const isBackgroundClick = e.target === lightboxContainer || e.target.classList.contains("js-lightbox-img-wrapper");
        // if (isBackgroundClick) {
        //     closeLightbox();
        // }
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

document.addEventListener("DOMContentLoaded", () => {
    thumbnailGallery();
    generalLightbox();
});

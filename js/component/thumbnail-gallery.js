import { getSlideKeyframes, slideOptions, openCloseOptions, getOpenKeyframes, getCloseKeyframes } from "../utility/animations.js";

// top-worksのサムネイルギャラリー関数
export const thumbnailGallery = () => {
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

        const closingAnim = selectedImage.animate(closingKeyframes, slideOptions);

        closingAnim.onfinish = () => {
            activeIndex = index;
            selectedImage.src = galleryItems[index].src;
            selectedImage.animate(openingKeyframes, slideOptions);
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
        const { closing, opening } = getSlideKeyframes(direction);

        const closingAnim = lightboxImg.animate(closing, slideOptions);
        closingAnim.onfinish = () => {
            const currentSrc = galleryItems[index].src;
            lightboxImg.src = currentSrc;
            lightboxImg.animate(opening, slideOptions);
        };
    };

    // lightboxを開く処理
    const openLightbox = () => {
        const { img: openImgKeyframes, bg: openBgKeyframes } = getOpenKeyframes();
        const currentSrc = galleryItems[activeIndex].src;
        lightboxImg.src = currentSrc;
        lightboxContainer.animate(openBgKeyframes, openCloseOptions);
        lightboxImg.animate(openImgKeyframes, openCloseOptions);
        lightboxContainer.classList.add("is-active");
        document.body.style.overflow = "hidden";
    };

    // lightboxを閉じる処理
    const closeLightbox = () => {
        const { img: closeImgKeyframes, bg: closeBgKeyframes } = getCloseKeyframes();
        const closingAnim = lightboxImg.animate(closeImgKeyframes, openCloseOptions);
        lightboxContainer.animate(closeBgKeyframes, openCloseOptions);
        closingAnim.onfinish = () => {
            lightboxContainer.classList.remove("is-active");
            document.body.style.overflow = "";
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

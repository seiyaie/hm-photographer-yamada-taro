//  スライドアニメーションのoptions
export const slideOptions = {
    duration: 200,
    easing: "ease-in-out",
};

// ライトボックス開閉アニメーションのoptions
export const openCloseOptions = {
    duration: 300,
    easing: "ease-in-out",
};

// スライドアニメーション
export const getSlideKeyframes = (direction, distance = 60) => {
    const offset = `${distance}px`;

    return {
        closing: {
            opacity: [1, 0],
            transform: direction === "next" ? [`translateX(0)`, `translateX(-${offset})`] : [`translateX(0)`, `translateX(${offset})`],
        },
        opening: {
            opacity: [0, 1],
            transform: direction === "next" ? [`translateX(${offset})`, `translateX(0)`] : [`translateX(-${offset})`, `translateX(0)`],
        },
    };
};

// ライトボックス開くアニメーション
export const getOpenKeyframes = () => ({
    img: {
        transform: ["scale(0.5)", "scale(1.0)"],
        opacity: [0, 1],
    },
    bg: {
        opacity: [0, 1],
    },
});

export const getCloseKeyframes = () => ({
  img: {
      transform: ["scale(1)", "scale(0.5)"],
      opacity: [1, 0],
  },
  bg: {
      opacity: [1, 0],
  }
});

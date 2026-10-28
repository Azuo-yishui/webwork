/* 页面交互彼此独立：页眉滚动态、移动导航与首页轮播分别初始化。 */
(() => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".site-nav");

    if (header) {
        const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            menuToggle.setAttribute("aria-label", isExpanded ? "打开导航菜单" : "关闭导航菜单");
            navigation.classList.toggle("is-open", !isExpanded);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target instanceof HTMLAnchorElement) {
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "打开导航菜单");
                navigation.classList.remove("is-open");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "打开导航菜单");
                navigation.classList.remove("is-open");
            }
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero__slide"));
    const dots = Array.from(document.querySelectorAll(".hero__dot"));
    const hero = document.querySelector(".hero");

    if (!hero || slides.length < 2 || dots.length !== slides.length) return;

    const previousButton = hero.querySelector(".hero__arrow--previous");
    const nextButton = hero.querySelector(".hero__arrow--next");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    let rotationTimer;

    if (activeIndex < 0) activeIndex = 0;

    const showSlide = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
            dots[index].classList.toggle("is-active", isActive);
            if (isActive) {
                dots[index].setAttribute("aria-current", "true");
            } else {
                dots[index].removeAttribute("aria-current");
            }
        });
    };

    const stopRotation = () => window.clearInterval(rotationTimer);
    const startRotation = () => {
        stopRotation();
        if (!reducedMotion.matches) {
            rotationTimer = window.setInterval(() => showSlide(activeIndex + 1), 6000);
        }
    };

    previousButton?.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        startRotation();
    });
    nextButton?.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        startRotation();
    });
    dots.forEach((dot, index) => dot.addEventListener("click", () => {
        showSlide(index);
        startRotation();
    }));

    hero.addEventListener("mouseenter", stopRotation);
    hero.addEventListener("mouseleave", startRotation);
    hero.addEventListener("focusin", stopRotation);
    hero.addEventListener("focusout", (event) => {
        if (!hero.contains(event.relatedTarget)) startRotation();
    });
    reducedMotion.addEventListener("change", startRotation);
    startRotation();
})();

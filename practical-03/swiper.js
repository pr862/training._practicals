const teamSwiper = new Swiper(".teamSwiper", {
  loop: true,
  spaceBetween: 20,

  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    bulletClass:
      "swiper-pagination-bullet w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm border border-gray-300 opacity-100 transition-all duration-300",
    bulletActiveClass:
      "swiper-pagination-bullet-active bg-red-300"
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 10
    },

    768: {
      slidesPerView: 1.75,
      centeredSlides: true,
      spaceBetween: 20
    },

    1024: {
      slidesPerView: 1.5,
      centeredSlides: true,
      spaceBetween: 30
    },

    1440: {
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 40
    },

    2560: {
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 50
    }
  }
});

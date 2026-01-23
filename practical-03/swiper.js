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

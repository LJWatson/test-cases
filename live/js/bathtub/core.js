(function () {
  "use strict";

  const slides = [];
  let currentSlideIndex = 0;

  function init () {
    document.querySelectorAll("[data-bathtub~=slide]").forEach((slide, index) => {
      slides.push(slide);

      slide.bathtub = {
        index: index,
        title: ''
      };

      if (slide.dataset.bathtubTitle) {
        slide.bathtub.title = slide.dataset.bathtubTitle
      }
      else {
        let slideHeading = slide.querySelector("h1, h2, h3, h4, h5, h6");
        if (slideHeading) {
          slide.bathtub.title = slideHeading.innerText;
        }
      }

      if (slide.getAttribute("id") === null) {
        slide.setAttribute("id", "bathtub-slide-" + (index + 1));
      }
      slide.bathtub.id = slide.getAttribute("id");

      if (index === 0) {
        slide.bathtub.first = true;
      }
      hideSlide(slide);
    });

    const hash = window.location.hash;
    let slideIndex = 0;
    if (hash) {
      slideIndex = getSlideIndexFromId(hash);
    }
    const startSlide = slides[slideIndex];
    document.dispatchEvent(
      new CustomEvent('bathtubShowSlide', {
        detail: {
          "slide": startSlide,
          "updateHistory": false
        }
      })
    );
    window.history.replaceState({ bathtubSlideIndex: startSlide.bathtub.index }, startSlide.bathtub.title, "#" + startSlide.bathtub.id);

    document.querySelectorAll("[data-bathtub~=previous]").forEach((element, index) => {
      element.addEventListener("click", function () {
        document.dispatchEvent(bathtubPreviousSlide);
      });
    });

    document.querySelectorAll("[data-bathtub~=next]").forEach((element, index) => {
      element.addEventListener("click", function () {
        document.dispatchEvent(bathtubNextSlide);
      });
    });

    slides[slides.length - 1].bathtub.last = true;
  }

  function hideSlide (slide) {
    slide.bathtub.current = false;
    slide.setAttribute("hidden", "");
  }

  document.addEventListener("bathtubShowSlide", function (e) {
    let slide = e.detail.slide;
    let slideIndex = e.detail.slideIndex;
    let slideId = e.detail.slideId;
    let updateHistory = e.detail.updateHistory;

    if (!slide) {
      if (!isNaN(slideIndex)) {
        slide = slides[slideIndex];
      }
      else if (slideId !== null) {
        slideIndex = getSlideIndexFromId(slideId);
        slide = slides[slideIndex];
      }
    }

    if (slide) {
      hideSlide(slides[currentSlideIndex]);
      slide.bathtub.current = true;
      currentSlideIndex = slide.bathtub.index;
      slide.removeAttribute("hidden");

      if (updateHistory !== false) {
        window.history.pushState({ bathtubSlideIndex: slide.bathtub.index }, slide.bathtub.title, "#" + slide.bathtub.id);
      }

      document.dispatchEvent(
        new CustomEvent('bathtubNewSlide', {
          detail: {
            "slide": slide,
            "currentSlideIndex": currentSlideIndex
          }
        })
      );
    }
  });

  function getSlideIndexFromId (slideId) {
    if (slideId.indexOf('#') !== 0) {
      slideId = '#' + slideId;
    }
    const slide = document.querySelector(slideId);
    const slideIndex = slide.bathtub.index;

    return slideIndex;
  }

  function switchSlide (slide) {
    document.dispatchEvent(
      new CustomEvent('bathtubShowSlide', {
        detail: {
          "slide": slide,
          "updateHistory": false
        }
      })
    );

  }

  const bathtubPreviousSlide = new window.CustomEvent("bathtubPreviousSlide");
  document.addEventListener("bathtubPreviousSlide", function (e) {
    let slide;

    if (slides[currentSlideIndex].bathtub.first === true) {
      slide = slides[slides.length - 1];
    } else {
      slide = slides[currentSlideIndex - 1];
    }

    document.dispatchEvent(
      new CustomEvent('bathtubShowSlide', {
        detail: {
          "slide": slide
        }
      })
    );
  });

  const bathtubNextSlide = new window.CustomEvent("bathtubNextSlide");
  document.addEventListener("bathtubNextSlide", function (e) {
    let slide;

    if (slides[currentSlideIndex].bathtub.last === true) {
      slide = slides[0];
    } else {
      slide = slides[currentSlideIndex + 1];
    }

    document.dispatchEvent(
      new CustomEvent('bathtubShowSlide', {
        detail: {
          "slide": slide
        }
      })
    );
  });

  document.addEventListener("DOMContentLoaded", init);

  window.addEventListener("popstate", function (e) {
    let slideIndex;
    if (e.state) {
      slideIndex = e.state.bathtubSlideIndex;
    }
    else {
      const hash = window.location.hash;
      slideIndex = getSlideIndexFromId(hash);
    }
    if (slideIndex !== null) {
      switchSlide(slides[slideIndex]);
    }
  });

})();

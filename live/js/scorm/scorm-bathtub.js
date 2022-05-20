(function () {
  "use strict";

  const scormerJS = window.parent.scormerJS;

  function init () {

    if (scormerJS) {
      scormerJS.setNavigateFunc(function (bookmark) {
        document.dispatchEvent(
          new CustomEvent('bathtubShowSlide', {
            detail: {
              "slideIndex": bookmark
            }
          })
        );
      });
    }

    document.addEventListener("bathtubNewSlide", function (e) {
      const slide = e.detail.slide;
      const currentSlideIndex = e.detail.currentSlideIndex;
      setLocation(currentSlideIndex);
      updateTitle(slide);
      setFocus(slide);
      disableNav(slide);
      scormEvents(slide);
      
    });

    setupTOC();
    setupGoToSlideNumber();
    externalLinks();
  }

  function setFocus (slide) {
    let focusTarget = slide;
    let heading = slide.querySelector('h1, h2 h3, h4, h5, h6');
    if (heading) {
      focusTarget = heading;
    }
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus();
    window.scrollTo(0, 0);
  }

  function disableNav (slide) {
    if (slide.bathtub.first) {
      document.querySelectorAll("[data-bathtub~=previous]").forEach((element, index) => {
        element.setAttribute("disabled", "");
      });
    }
    else {
      document.querySelectorAll("[data-bathtub~=previous]").forEach((element, index) => {
        element.removeAttribute("disabled");
      });
    }

    if (slide.bathtub.last) {
      document.querySelectorAll("[data-bathtub~=next]").forEach((element, index) => {
        element.setAttribute("disabled", "");
      });
    }
    else {
      document.querySelectorAll("[data-bathtub~=next]").forEach((element, index) => {
        element.removeAttribute("disabled");
      });
    }

    document.querySelectorAll("[data-scorm-goto]").forEach((element, index) => {
      if (parseInt(element.dataset.scormGoto) === slide.bathtub.index + 1) {
        element.setAttribute("disabled", "");
      }
      else {
        element.removeAttribute("disabled");
      }
    });
  }

  function setLocation (currentSlideIndex) {
    if (scormerJS) {
      scormerJS.setLocation(currentSlideIndex);
    }
  }

  function scormEvents (slide) {
    if (scormerJS) {
      if (slide.bathtub.last) {
        scormerJS.setCompleted();
      }
    }
  }

  function updateTitle (slide) {
    var title = slide.bathtub.title;
    document.querySelector('title').textContent = title;
    if (scormerJS) {
      scormerJS.setTitle(title)
    }
  }

  function setupTOC () {
    let tocButton = document.querySelector('[data-scorm-toc');
    if (tocButton) {
      let tocSlideId = tocButton.dataset.scormToc;
      tocButton.addEventListener('click', () => {
        document.dispatchEvent(
          new CustomEvent('bathtubShowSlide', {
            detail: {
              "slideId": tocSlideId
            }
          })
        );
      })
    }
  }

  function setupGoToSlideNumber () {
    let gotoButton = document.querySelector('[data-scorm-goto]');
    if (gotoButton) {
      let gotoSlideNumber = parseInt(gotoButton.dataset.scormGoto) - 1;
      gotoButton.addEventListener('click', () => {
        document.dispatchEvent(
          new CustomEvent('bathtubShowSlide', {
            detail: {
              "slideIndex": gotoSlideNumber
            }
          })
        );
      })
    }
  }

  function externalLinks () {
    let links = document.querySelectorAll('a[href^="http"]');
    links.forEach((link) => {
      const externalLinkEl = document.createElement('span');
      externalLinkEl.classList.add('external-link');
      const textEl = document.createElement('span');
      textEl.classList.add('external-link-text');
      textEl.classList.add('sr-only');
      textEl.textContent = ' (Opens in new tab/window)';
      const iconEl = document.createElement('span')
      iconEl.classList.add('external-link-icon');
      iconEl.setAttribute('aria-hidden', 'true');
      externalLinkEl.appendChild(textEl);
      externalLinkEl.appendChild(iconEl);
      link.appendChild(externalLinkEl);
      link.setAttribute("target", "_blank");
    });
  }

  document.addEventListener("DOMContentLoaded", init);

})();

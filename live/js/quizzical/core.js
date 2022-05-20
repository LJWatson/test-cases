(function () {
  "use strict";

  // For quiz data
  const answers = [];
  let totalScore = 0;
  let totalScoreOutOf = 0;

  // For checklist data
  let checklists = {};
  let checklistsScormData = {};

  const defaultChecklistKey = "default";

  checklists["bar"] = {
    "baz": "qux"
  }

  const scormerJS = window.parent.scormerJS;

  function init () {

    document.addEventListener("bathtubNewSlide", function (e) {
      const slide = e.detail.slide;
      const currentSlideIndex = e.detail.currentSlideIndex;
      if (slide.dataset.quizzical !== undefined && slide.dataset.quizzicalInitiated !== 'true') {
        slide.dataset.quizzicalInitiated = 'true';
        disableAdvance(slide);

        const submitEls = slide.querySelectorAll('[data-submit]');
        submitEls.forEach(function (submitEl) {
          submitEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // Check the answers
            checkAnswers(slide, e);
            if (!this.hasAttribute('aria-pressed')) {
              // Remove the control so that the questions can only be answered once
              this.parentNode.removeChild(this);
            }
          });
        });
      }

      if (slide.dataset.quizzicalScore !== undefined) {
        showScores(slide);
        recordScores();
      }

      if (slide.dataset.quizzicalChecklist !== undefined && slide.dataset.quizzicalChecklistInitiated !== 'true') {
        if (checklistsScormData["checklist"] === undefined) {
          getCheckListData();
        }
        slide.dataset.quizzicalChecklistInitiated = 'true';

        let checklistKey = slide.dataset.quizzicalChecklist;

        registerChecklist(slide, checklistKey)
        updateChecklist(slide, checklistKey);
        updateChecklistStatus(checklistKey);
      }

    });
  }

  function setCheckListData () {
    if (scormerJS) {
      scormerJS.setData("checklists", checklists);
    }
  }

  function getCheckListData () {
    if (scormerJS) {
      checklistsScormData = scormerJS.getData();
      if (checklistsScormData && checklistsScormData["checklists"]) {
        checklists = checklistsScormData["checklists"];
      }
    }
  }

  function registerChecklist (slide, checklistKey) {
    checklistKey = checklistKey || defaultChecklistKey;
    if (!checklists[checklistKey]) {
      checklists[checklistKey] = {};
    }
  }

  function updateChecklist (slide, checklistKey) {
    checklistKey = checklistKey || defaultChecklistKey;
    let checklistItems =  slide.querySelectorAll('[data-checklist] input');
    checklistItems.forEach(function (checklistItem) {
      let checklistItemName = checklistItem.getAttribute('name');
      if (!checklists[checklistKey][checklistItemName]) {
        checklists[checklistKey][checklistItemName] = checklistItem.checked;
      }
      else {
        checklistItem.checked = checklists[checklistKey][checklistItemName];
      }

      checklistItem.addEventListener('change', function (e) {
        let checklistItem = e.target;
        let checklistItemName = checklistItem.getAttribute('name');
        let checkListParent = e.target.closest('[data-quizzical-checklist]');
        let checklistKey = checkListParent.dataset.quizzicalChecklist || defaultChecklistKey;
        checklists[checklistKey][checklistItemName] = checklistItem.checked;

        updateChecklistStatus(checklistKey);
        setCheckListData();
      });
    });
  }

  function updateChecklistStatus (checklistKey) {
    checklistKey = checklistKey || defaultChecklistKey;
    let checklistStatusContainers = document.querySelectorAll('[data-quizzical-checklist-status]');

    checklistStatusContainers.forEach(function (checklistStatusContainer) {
      let checklistStatusContainerKey = checklistStatusContainer.dataset.quizzicalChecklistStatus || defaultChecklistKey;
      if (checklistStatusContainerKey === checklistKey) {
        let checklist = checklists[checklistKey];
        let checkedItems = 0;
        let totalItems = 0;
        for (let checklistItem in checklist) {
          totalItems++;
          if (checklist[checklistItem] === true) {
            checkedItems++;
          }
        }
        let checklistStatusText = checkedItems + " of " + totalItems + "";
        checklistStatusContainer.textContent = checklistStatusText;
      }
    });
  }

  function showScores () {
    const results = document.querySelector("[data-quizzical-score-results]");
    if (results.dataset.quizzicalScoreResults !== "scored") {
      results.dataset.quizzicalScoreResults = "scored";
      results.innerHTML = '<p>You have scored <strong>' + totalScore + '</strong> out of <strong>' + totalScoreOutOf + '</strong> questions correctly.';
    }
  }

  function recordScores () {
    const percentageScore = Math.round(totalScore / totalScoreOutOf * 100);
    if (scormerJS && percentageScore !== NaN) {
      scormerJS.setScore(percentageScore)
    }
  }

  function checkAnswers (slide, e) {
    var questions = slide.querySelectorAll('[data-question]');
    var score = 0;
    var scoreOutOf = questions.length;
    var scoreElement = document.createElement('p');
    var heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    var scoreContainer = slide.querySelector('[data-score]');
    var target = e.target;
    var advanceSlide = (target.dataset.submit === 'next');

    // Iterate over the questions
    questions.forEach((question, index) => {
      var answers = question.querySelectorAll('[data-answer]');
      var text = question.querySelectorAll('[data-question-text]').innerText;
      var feedback = question.querySelector('[data-feedback]');
      var correct = 0;
      var incorrect = 0;
      var questionSuccessElement = document.createElement('h2');

      // Iterate over each answer input within a set of answers for a single question,
      // Answer inputs are either checkboxes or radio buttons
      answers.forEach((answer, index) => {
          var input = answer.querySelector('input');
          var button = answer.querySelector('button');

          if (input) {
            // If the answer is checked
            if (input.checked) {
                // If the answer is a correct choice and therefore _should_ be checked
                if (answer.dataset.answer === 'true') {
                    // Increment number of correct answers
                    correct++;
                } else {
                    // Increment number of incorrect answers
                    incorrect++;
                }
            // If the answer is a correct choice but has not been checked
            } else if (answer.dataset.answer === 'true') {
                // Increment number of incorrect answers
                incorrect++;
            }

            // Disable each input so that the answers can't be changed
            input.setAttribute('disabled', 'disabled');
          }
          else if (button) {
            console.debug('button');
            button.setAttribute('disabled', 'disabled');
            console.debug((button === target));
            if (button === target) {
              button.setAttribute('aria-pressed', 'true');
              if (answer.dataset.answer === 'true') {
                correct++;
              }
            }
            button.setAttribute('disabled', 'disabled');
            console.debug(correct);
          }
      });

      // When checkboxes are used it is possible to be partially correct, i.e. some of the
      // correct answers have been checked

      totalScoreOutOf++;
      // If all of the possible correct answers have been checked
      if (correct > 0 && incorrect === 0) {
          questionSuccessElement.innerHTML = '<strong>Correct answer</strong>';
          // For a fully correct answer, increment the score
          score++;
          totalScore++;
      // If some of the possible correct answers have been checked, but not all
      } else if (correct > 0 && incorrect > 0) {
          questionSuccessElement.innerHTML = '<strong>Almost right…</strong>';
      // If none the possible correct answers have been checked
      } else {
          questionSuccessElement.innerHTML = '<strong>Incorrect answer</strong>';
      }

      if (feedback) {
        feedback.insertBefore(questionSuccessElement, feedback.firstChild);
      }

      question.classList.add('answered');
    });

    // Display the score for all questions on the slide
    let scoreString = ''
    if (scoreOutOf > 1) {
      scoreString += '<strong>You have answered ' + score + ' out of ' + scoreOutOf + ' questions correctly.</strong>';

      if (feedback) {
        scoreString += 'See below for answers.';
      }
    }

    scoreElement.innerHTML = scoreString;
    scoreElement.setAttribute('tabindex', '-1');
    scoreElement.classList.add('score');

    if (scoreContainer) {
        scoreContainer.appendChild(scoreElement);
    } else {
        heading.parentNode.insertBefore(scoreElement, heading.nextSibling);
    }

    enableAdvance(slide);

    // Set focus to the score so it is announced, unless auto advancing to the next slide is enabled
    // The score element will be before the quiz questions and answer information
    // so the user can navigate the rest of the content from this point for feedback
    if (advanceSlide) {
      let bathtubNextSlide = new window.CustomEvent("bathtubNextSlide");
      document.dispatchEvent(bathtubNextSlide);
    } else {
      scoreElement.focus();
    }
  }

  function disableAdvance (slide) {
    document.querySelectorAll("[data-bathtub~=next]").forEach((element, index) => {
      element.setAttribute("disabled", "");
    });
  }

  function enableAdvance (slide) {
    if (!slide.bathtub.last) {
      document.querySelectorAll("[data-bathtub~=next]").forEach((element, index) => {
        element.removeAttribute("disabled");
      });
    }
  }

  function advance (slide) {
    if (!slide.bathtub.last) {
      document.dispatchEvent(bathtubPreviousSlide);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

})();

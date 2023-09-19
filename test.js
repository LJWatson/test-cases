window.onload = function() {

'use strict';

let card = document.getElementById("card");

function flipCard(e) {

if (card.innerText == "Front") {
card.innerText = "Back";
card.setAttribute("aria-pressed", "true");
} else {
card.innerText = "Front";
card.setAttribute("aria-pressed", "false");
}
}

card.addEventListener('click', flipCard, false);

};

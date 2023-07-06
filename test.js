window.onload = function() {

'use strict';

let card = document.getElementById("card");

function flipCard(e) {

if (card.innerText == "Front") {
card.innerText = "Back";
} else {
card.innerText = "Front";
}
}

card.addEventListener('click', flipCard, false);

};

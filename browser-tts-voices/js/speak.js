(function() {
    'use strict';

    function init() {

        // Check for Web Speech support.
        if (window.SpeechSynthesisUtterance === undefined) {
            alert("This browser does not support the Web Speech API");
        } else {
            document.getElementById("button").addEventListener("click", speakUtterance);
        }
    }

    function speakUtterance(event) {

        // Create speech object.
        var utterance = new SpeechSynthesisUtterance();
        utterance.text = "Tequila";

        // Speak utterance.
        window.speechSynthesis.speak(utterance);
    }

    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})();

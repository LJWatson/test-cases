(function() {
    'use strict';

    function init() {

        // Check for Web Speech support.
        if (window.SpeechSynthesisUtterance === undefined) {
            alert("This browser does not support the Web Speech API");
        } else {
            let tts;

            // Workaround for Chrome bug (getVoices() fails onload).
            let watch = setInterval(function() {

                // Retrieve and display available TTS engines.
                tts = speechSynthesis.getVoices();
                let voices = document.getElementById("voices");

                if (tts.length !== 0) {

                    for (var i = 0; i < tts.length; i++) {

                        voices.innerHTML += '<option value="' + tts[i].name + '">' + tts[i].name + '</option>';
                    }

                    clearInterval(watch);
                }
            }, 1);

            document.getElementById("button").addEventListener('click', function(event) {

                // Retrieve index of selected TTS engine.
                let selectedVoice = voices.selectedIndex;

                // Create speech object.
                let utterance = new SpeechSynthesisUtterance();
                utterance.text = voices[selectedVoice].text;

                // Assign selected TTS engine to speech object.
                utterance.voice = tts[selectedVoice];

                // Speak utterance.
                window.speechSynthesis.speak(utterance);
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        init();
    });

})();
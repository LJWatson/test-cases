(function () {
    'use strict';

    var button = document.getElementById("button");
    var notification = document.getElementById("notification");

    notification.setAttribute("aria-live", "polite");
    notification.setAttribute("aria-atomic", "true");

    function notify() {
        notification.innerText = "This is the first notification. It is intended to take longer than one second for a screen reader to speak, so the concatenation of notifications can be tested.";

        wait(200)
            .then(() => {
                notification.innerText = "Ping!";
                console.log("This message will be logged after 250ms");

                wait(250)
                    .then(() => {
                        notification.innerText = "This is the third notification.";
                        console.log("This message will be logged after 250ms");

                    })

            })
    }

    function wait(milliseconds, action) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }


    button.addEventListener("click", notify);

})();

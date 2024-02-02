(function () {
    'use strict';

    var button = document.getElementById("button");
    var notification = document.getElementById("notification");

    notification.setAttribute("aria-live", "polite");
    notification.setAttribute("aria-atomic", "true");

    function notify() {
        notification.innerText = "You've been notified!";

        wait(500)
            .then(() => {
                notification.innerText = "";
                console.log("This message will be logged after 500ms");
            })
    }

    function wait(milliseconds, action) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }


    button.addEventListener("click", notify);

})();

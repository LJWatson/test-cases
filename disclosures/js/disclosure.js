(function () {
    // Cache the parent element if there's a specific container for the details elements.
    // If not, using document is fine.
    const container = document;

    //Delegate event listener
    container.addEventListener('click', function (event) {
        const targetDetail = event.target.closest('details');

        // Do nothing if the clicked element is not a details element
        if (!targetDetail) return;

        //Query and cache details elements as array
        const detailsArray = Array.from(container.querySelectorAll('details'));

        // Close other details when one is opened
        detailsArray.forEach((detail) => {
            if (detail !== targetDetail) {
                detail.removeAttribute('open');
            }
        });
    });
})();

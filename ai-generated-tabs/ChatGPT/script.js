
    // Get all tab buttons and tab content
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hide all tab content
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Show the selected tab content
        const tabId = button.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.style.display = 'block';
        }

        // Set the focus to the selected button for accessibility
        button.focus();
    });
});


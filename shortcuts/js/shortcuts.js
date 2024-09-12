document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'x' or 'X'
        if (event.key === 'x' || event.key === 'X') {
            alert('You pressed the X key!');
        }
    });
});

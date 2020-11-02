export default {
    waiting = false, // Game paused?
    points: { // Points counter
        'bot': 0,
        'user': 0
    },

    updatePoints(point, to) {
        if (point === 1) {
            // Add a point
            points[to] += 1;
        } else if (point === -1 && points[to] !== 0) {
            // Withdraw a point (if not already at 0)
            points[to] -= 1;

            // Take upper set away
            // moveSetAway([], 'none')
        }

        // Update text
        const $el = $('.' + to + ' p');
        $el.text(points[to] + ' set' + (points[to] > 1 ? 's' : ''));
    },

    /**
     * Show button to add three cards
     */
    showAddThree() {
        // Generate button
        let $button = $('<div>', { class: 'add-three-button' });
        $button.text('Add three cards ?');

        // Bind click event
        $button.on('click', () => {
            $button.remove();
            for (let i = 0; i < 3; i += 1) randomCard();
            test = 0;
        });

        // Append button to .botton-row
        $('.bottom-row').append($button);
    }
}
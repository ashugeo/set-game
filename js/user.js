export default {
    /**
     * User has cliked "Set" button
     */
    userSet() {
        // Bot has found one before
        if (ai.foundSet) return false;

        // Add 10 seconds countdown to .bottom-row
        const countdown = `<div class="countdown">
            <div class="countdown-number"></div>
            <svg>
                <circle r="14" cx="25" cy="15"></circle>
            </svg>
        </div>`;

        $('.bottom-row').prepend(countdown);

        // Waiting for user to pick three cards
        waiting = true;

        // Start a 10 seconds clock
        clock.countdown(10);

        // Stop bot tests
        ai.foundSet = true;

        // Change button text
        $('.set-button').text('Click three cards').addClass('disabled');

        // Make cards clickable
        $('.wrapper').addClass('waiting');
    },

    /**
     * User clicks a card
     * @param  {Object} $div jQuery object
     */
    clickCard($div) {
        // Toggle selected class to this card
        $div.toggleClass('selected');

        if ($('.card.selected').length === 3) { // 3 cards have been selected

            // Stop the clock, remove the countdown
            clearTimeout(clockTimeout);
            $('.countdown').remove();

            // Create array with the three selected cards
            let selected = [];
            $('.card.selected').each((_, elem) => {
                selected.push(parseInt($(elem).attr('id')));
            });

            // Find the third card depending on the first two
            let target = findThird(cards[selected[0]], cards[selected[1]]);
            findCardID(target);

            // Check if it corresponds to the third selected card
            if (findCardID(target) === selected[2]) { // User found a set!
                // Display valid set, move it away, increment points, add a new set
                validSet([selected[0], selected[1], selected[2]], 'user');

                // Unselect
                $('.card.selected').removeClass('selected');

                // Change "Set" button text
                $('.set-button').text('Well done!');
            } else { // User is wrong
                // Change "Set" button text
                $('.set-button').text('Sorry, no...');

                // Withdraw one point
                updatePoints(-1, 'user');

                setTimeout(() => {
                    // Unselect
                    $('.card.selected').removeClass('selected');

                    // User can play again
                    $('.set-button').text('Set !').removeClass('disabled');

                    // Launch bot tests again
                    ai.foundSet = false;
                    ai.solve();
                }, 3000);
            }
        }
    }
}
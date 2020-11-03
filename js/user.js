import ai from './ai.js';
import board from './board.js';
import clock from './clock.js';
import deck from './deck.js';
import game from './game.js';

export default {
    init() {
        $(document).on('click', 'button.main', () => this.userSet());

        $(document).on('keydown', e => {
            // User pressed space bar, same as clicking "Set" button
            if (e.which === 32) {
                $('button.main').addClass('active');
                this.userSet();
                clearTimeout(ai.solveTimeout);
            }
        });

        $(document).on('keyup', e => {
            if (e.which === 32) $('button.main').removeClass('active');
        });
    },

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
        game.waiting = true;

        // Start a 10 seconds clock
        clock.countdown(10);

        // Stop bot tests
        ai.foundSet = true;

        // Change button text
        $('.set-button').text('Click three cards').addClass('disabled');

        // Make cards clickable
        $('main').addClass('waiting');
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
            clearTimeout(clock.timeout);
            $('.countdown').remove();

            // Create array with the three selected cards
            let selected = [];
            $('.card.selected').each((_, elem) => {
                selected.push(parseInt($(elem).attr('id')));
            });

            // Find the third card depending on the first two
            let target = ai.findThird(deck.cards[selected[0]], deck.cards[selected[1]]);

            // Check if it corresponds to the third selected card
            if (deck.findCardID(target) === selected[2]) { // User found a set!
                // Display valid set, move it away, increment points, add a new set
                board.validSet([selected[0], selected[1], selected[2]], 'user');

                // Change "Set" button text
                $('.set-button').text('Well done!');
            } else { // User is wrong
                // Change "Set" button text
                $('.set-button').text('Sorry, no...');

                // Withdraw one point
                game.updatePoints(-1, 'user');

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
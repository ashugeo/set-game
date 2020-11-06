import ai from './ai.js';
import board from './board.js';
import clock from './clock.js';
import deck from './deck.js';
import game from './game.js';
import sound from './sound.js';

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

        $(document).on('click', '.controls .sound', e => {
            sound.on = !sound.on;

            if (sound.on) {
                $('.fa-volume-up').removeClass('hidden');
                $('.fa-volume-off').addClass('hidden');
                sound.play('click');
            } else {
                $('.fa-volume-off').removeClass('hidden');
                $('.fa-volume-up').addClass('hidden');
            }
        });

        $(document).on('click', 'button.secondary', () => {
            for (let i = 0; i < 3; i += 1) deck.randomCard();
            ai.test = 0;
        });

        $(document).on('click', '.difficulty ul li', e => {
            const $el = $(e.currentTarget);
            $el.closest('ul').find('li.selected').removeClass('selected');
            $el.addClass('selected');
            sound.play('click');

            if ($el.hasClass('easy')) ai.speed = 1000;
            else if ($el.hasClass('medium')) ai.speed = 500;
            else if ($el.hasClass('hard')) ai.speed = 200;
        });
    },

    /**
     * User has cliked "Set" button
     */
    userSet() {
        // Bot has found one before
        if (ai.foundSet) return false;

        // Waiting for user to pick three cards
        game.waiting = true;

        // Start a 10 seconds clock
        clock.countdown(10);

        // Stop bot tests
        ai.foundSet = true;

        // Change button text
        $('button.main').html('10<span>Click 3 cards</span>').attr('disabled', true);

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
        const selected = $('.card.selected').length

        if (selected === 1) {
            sound.play('1');
        } else if (selected === 2) {
            sound.play('2');
        } else if (selected === 3) { // 3 cards have been selected

            // Stop the clock, remove the countdown
            clearTimeout(clock.timeout);
            $('.countdown').remove();

            // Create array with the three selected cards
            const triad = [];
            $('.card.selected').each((_, elem) => {
                cards.push(parseInt($(elem).attr('id')));
            });

            // Find the third card depending on the first two
            const target = ai.findThird(deck.cards[triad[0]], deck.cards[triad[1]]);

            // Check if it corresponds to the third selected card
            if (deck.findCardID(target) === triad[2]) { // User found a set!
                sound.play('4');

                // Display valid set, move it away, increment points, add a new set
                board.validSet([triad[0], triad[1], triad[2]], 'user');

                // Change "Set" button text
                $('button.main').text('Well done!');
            } else { // User is wrong
                sound.play('3');

                // Change "Set" button text
                $('button.main').text('Sorry, no...');

                // Withdraw one point
                game.updatePoints(-1, 'user');

                setTimeout(() => {
                    // Unselect
                    $('.card.selected').removeClass('selected');
                    
                    // User can play again
                    $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled');

                    $('main').removeClass('waiting');

                    // Launch bot tests again
                    game.waiting = false;
                    ai.foundSet = false;
                    ai.solve();
                }, 3000);
            }
        }
    }
}
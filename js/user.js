import ai from './ai.js';
import board from './board.js';
import clock from './clock.js';
import deck from './deck.js';
import game from './game.js';
import sound from './sound.js';

export default {
    init() {
        console.log('user init');

        $(document).on('click', 'button.main', () => {
            if (game.waiting) return;

            this.userSet();
            return false;
        });

        $(document).on('keydown', e => {
            if (game.waiting) return;

            // User pressed space bar, same as clicking "Set" button
            if (e.which === 32) {
                // Prevent space bar from firing a focused button
                e.preventDefault();

                $('button.main').addClass('active');
                this.userSet();
                clearTimeout(ai.solveTimeout);
            }
        });

        $(document).on('keyup', e => {
            if (e.which === 32) $('button.main').removeClass('active');
        });

        $(document).on('click', 'aside button.secondary', e => {
            // Stop bot
            clearTimeout(ai.solveTimeout);
            deck.show += 3;

            // Disable button
            $(e.currentTarget).attr('disabled', true);
            $('aside').removeClass('openable');

            const cards = $('main .card').toArray().sort((a, b) => {
                a = parseInt($(a).attr('data-pos'));
                b = parseInt($(b).attr('data-pos'));

                return a < b ? -1 : 1;
            });

            cards.forEach((card, i) => {
                setTimeout(() => deck.updateCardPos($(card)), i * 50);
            });

            setTimeout(() => {
                deck.draw3Cards();
                setTimeout(() => game.unfreeze(), game.delay['resume']);
            }, 1000);
        });

        $(document).on('click', '.difficulty ul li', e => {
            const $el = $(e.currentTarget);
            $el.closest('ul').find('li.selected').removeClass('selected');
            $el.addClass('selected');
            sound.play('click');

            if ($el.hasClass('easy')) ai.speed = 2000;
            else if ($el.hasClass('medium')) ai.speed = 1500;
            else if ($el.hasClass('hard')) ai.speed = 1000;
        });

        $(document).on('click', '.difficulty', () => false);

        $(window).resize(() => {
            for (const card of $('.card:not(.locked)').toArray()) {
                deck.updateCardPos($(card));
            }
        });

        $(window).on('beforeunload', () => {
            if (game.started) return false;
        });

        $(document).on('visibilitychange', () => {
            if (document.hidden) game.pause();
        });

        $(document).on('click', '.pause button', () => {
            game.resume();
        });

        $(document).on('input', '.pause input#show', () => {
            $('main').toggleClass('shown');
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
        $('button.main').html('<div class="count">10</div><span>Select 3 cards</span>').attr('disabled', true).addClass('waiting');

        // Make cards clickable
        $('main').addClass('waiting');
    },

    /**
     * User clicks a card
     * @param  {Object} $div jQuery object
     */
    clickCard($div) {
        if ($('main').is(':not(.waiting)')) return;

        if ($('.card.selected').length === 3) return;

        // Toggle selected class to this card
        $div.toggleClass('selected');
        const selected = $('.card.selected').length;

        if (selected === 1) {
            sound.play('1');
        } else if (selected === 2) {
            sound.play('2');
        } else if (selected === 3) { // 3 cards have been selected

            // Stop the clock
            clearTimeout(clock.timeout);

            // Create array with the three selected cards
            const triad = [];
            $('.card.selected').each((_, elem) => {
                triad.push(parseInt($(elem).attr('id')));
            });

            // Find the third card depending on the first two
            const target = ai.findThird(deck.cards[triad[0]], deck.cards[triad[1]]);

            // Check if it corresponds to the third selected card
            if (deck.findCardID(target) === triad[2]) { // User found a set!
                sound.play('4');

                // Display valid set, move it away, increment points, add a new set
                board.validSet([triad[0], triad[1], triad[2]], 'user');

                // Change "Set" button
                $('button.main').html('Well done!').removeClass('waiting');
            } else { // User is wrong
                sound.play('3');

                // Change "Set" button
                $('button.main').html('Wrong!<span>This is not a Set</span>').removeClass('waiting');

                // Withdraw one point
                game.updatePoints(-1, 'user');

                setTimeout(() => {
                    // Unselect
                    $('.card.selected').removeClass('selected');
                    $('main').removeClass('waiting');

                    game.unfreeze();
                }, game.delay['show-user-fail']);
            }
        }
    }
}
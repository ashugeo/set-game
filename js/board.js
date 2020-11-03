import ai from './ai.js';
import deck from './deck.js';
import game from './game.js';

export default {
    zIndex: 0, // z-index of a card

    /**
     * Display valid set, then move it away and update points
     * @param  {array}  set IDs of 3 cards
     * @param  {string} to  'bot' or 'user'
     */
    validSet(set, to) {
        // Remove add-three-button
        $('.add-three-button').remove();

        // Display valid set
        this.showValidSet(set);

        setTimeout(() => {
            // Move set away
            this.moveSetAway(set, to);

            // Increment points
            game.updatePoints(1, to);

            setTimeout(() => {
                $('main').removeClass('waiting');

                if (deck.shown.length === 9) {
                    // Add a new set
                    deck.draw3Cards();
                } else if (deck.shown.length > 9) {
                    // Reorganize displayed cards
                    this.reorganizeCards();
                }

                setTimeout(() => {
                    // User can play again
                    $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled');

                    // Launch bot tests again
                    ai.foundSet = false;
                    ai.test = 0;
                    ai.solve();
                }, 2000);
            }, 500);
        }, 2000);
    },

    /**
     * Show a valid set
     * @param  {array} set IDs of 3 cards
     */
    showValidSet(set) {
        $('main').addClass('set');

        for (let id of set) $('.card#' + id).addClass('set locked');
    },

    /**
     * Move a valid set away (to either bot or user)
     * @param  {array}  set IDs of 3 cards
     * @param  {string} to  'bot' or 'user'
     */
    moveSetAway(set, to) {
        let delay = 0;

        for (let id of set) {
            setTimeout(() => {
                // Remove card from currently-displayed array
                deck.removeCurrentByID(id);

                // Move card away
                this.moveCardAway(id, to);
            }, delay * 200);
            delay += 1;
        }
    },

    /**
     * Move a card away
     * @param  {int}    id card ID
     * @param  {string} to 'bot' or 'user'
     */
    moveCardAway(id, to) {
        $('main').removeClass('set');

        // Save emptied positions for new set to appear
        deck.emptyPos.push(parseInt($('.card#' + id).attr('data-pos')));

        // Move cards
        $('.card#' + id).removeClass('selected set').attr('data-pos', to).css({
            left: $('.' + to + ' .sets-wrapper').offset().left,
            top: $('.' + to + ' .sets-wrapper').offset().top - 4,
            zIndex: this.zIndex++
        });
    },

    /**
     * Reorganize cards on the table
     * @TODO: Works for 12 cards but not more
     * @TODO: Second 'add-three-button' press will place new cards badly
     * @TODO: Rework whole process
     */
    reorganizeCards() {
        // Build array of slots
        let slots = Array.from(new Array(12), (_, i) => i);

        // Build array of currently-displayed cards' positions
        let allPos = [];
        deck.shown.forEach((card) => {
            let pos = parseInt($('.card#' + card.id).attr('data-pos'));
            allPos.push(pos);
        });

        // Compute empty slots
        let emptySlots = slots.filter(x => allPos.indexOf(x) == -1);

        // Move right-most cards to empty spots on their left
        for (let slot of emptySlots) {
            // Basic movement is one slot to the left
            let shift = 1;

            for (let i = slot % 4 + 1; i < 4; i += 1) { // From (empty spot + 1) to the end of the row

                // Card to move
                let card = slot - slot % 4 + i;

                // If card isn't at this spot anymore, increment shift for next cards
                if (emptySlots.indexOf(card) !== -1) {
                    shift += 1;
                    continue;
                }

                // Card's new position
                const newPos = card - shift;

                // Update card's position
                this.updatePos(card, newPos);
            }
        }

        // Rebuild array of currently-displayed cards' positions
        allPos = [];
        deck.shown.forEach(card => {
            let pos = parseInt($('.card#' + card.id).attr('data-pos'));
            allPos.push(pos);
        });

        // Compute empty slots again
        emptySlots = slots.filter(x => allPos.indexOf(x) == -1);

        // Move last column's cards to empty spots
        for (let card of allPos) {
            if (card > 11) {
                // Card's new position
                const newPos = emptySlots[0];

                // Update card's position
                this.updatePos(card, newPos);

                emptySlots.shift();
            }
        }
    },

    /**
     * Update a card's position
     * @param  {int} card   card's old position
     * @param  {int} newPos target position
     * @TODO: Refactor CSS positioning
     */
    updatePos(card, newPos) {
        // Get jQuery card object
        const $card = $('.card[data-pos="' + card + '"]');

        // Update data-pos attribute
        $card.attr('data-pos', newPos);

        // Update position
        if (newPos < 12) {
            $card.css({
                top: Math.floor(newPos / 4) * 220 + ($(window).outerHeight() - 800) / 2 + 40,
                left: (newPos % 4) * 164 + ($(window).outerWidth() - 600)/2
            });
        } else {
            $card.css({
                top: (newPos % 3) * 220 + ($(window).outerHeight() - 800) / 2 + 40,
                left: Math.floor(newPos / 3) * 164 + ($(window).outerWidth() - 600) / 2
            });
        }
    }
}
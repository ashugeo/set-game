import ai from './ai.js';
import deck from './deck.js';
import game from './game.js';

export default {
    zIndex: 10, // z-index of a card

    reset() {
        this.zIndex = 10;
    },

    /**
     * Display valid set, then move it away and update points
     * @param  {array}  set    IDs of 3 cards
     * @param  {string} winner 'bot' or 'user'
     */
    validSet(set, winner) {
        // Disable add-three-button
        $('button.secondary').attr('disabled', true);
        $('aside').removeClass('openable');

        // Display valid set
        this.showValidSet(set);

        setTimeout(() => {
            // Move set away
            this.moveSetAway(set, winner);

            for (let id of set) {
                // Remove card from currently-displayed array
                deck.removeCurrentByID(id);
            }

            // Increment points
            game.updatePoints(1, winner);

            setTimeout(() => {
                $('main').removeClass('waiting');

                if (deck.shown.length === 9) {
                    // Add a new set
                    deck.show += 3;
                    deck.draw3Cards();
                } else if (deck.shown.length > 9) {
                    // Reorganize displayed cards
                    this.reorganizeCards();
                }

                setTimeout(() => game.unfreeze(), game.delay['resume']);
                
            }, game.delay['add-cards']);
        }, game.delay[`show-${winner}-set`]);
    },

    /**
     * Show a valid set
     * @param  {array} set IDs of 3 cards
     */
    showValidSet(set) {
        $('main').addClass('set');

        for (let id of set) $(`.card#${id}`).addClass('set locked');
    },

    /**
     * Move a valid set away (to either bot or user)
     * @param  {array}  set    IDs of 3 cards
     * @param  {string} winner 'bot' or 'user'
     */
    moveSetAway(set, winner) {
        deck.show -= 3;

        for (let [i, id] of set.entries()) {
            // Move card away
            setTimeout(() => this.moveCardAway(id, winner), i * 200);
        }
    },

    /**
     * Move a card away
     * @param  {int}    id     card ID
     * @param  {string} winner 'bot' or 'user'
     */
    moveCardAway(id, winner) {
        $('main').removeClass('set');

        const $card = $(`.card#${id}`);

        // Update card's position
        $card.removeClass('selected set').attr('data-pos', winner).css({
            left: $(`.${winner} .sets-wrapper`).offset().left,
            top: $(`.${winner} .sets-wrapper`).offset().top - 80,
            zIndex: this.zIndex++
        });

        setTimeout(() => {
            // Move card to winner's sets wrapper
            $card.css({ left: '', top: '' });
            $(`.${winner} .sets-wrapper`).append($card);
        }, 500);
    },

    /**
     * Reorganize cards on the table
     */
    reorganizeCards() {
        // Move card to left if possible
        for (const card of $('.card:not(.locked)').toArray()) {
            const $card = $(card);
            const pos = parseInt($card.attr('data-pos'));

            let newPos = pos;
            while (newPos - 3 > 0) {
                if ($(`.card[data-pos="${newPos - 3}"]`).is(':not(.locked)')) break;
                newPos -= 3;
            }

            $card.attr('data-pos', newPos);
            deck.updateCardPos($card, newPos);
        }

        // Fill remaining empty spots
        for (const card of $('.card:not(.locked)').toArray()) {
            const $card = $(card);
            const pos = parseInt($card.attr('data-pos'));
            if (pos < 12) continue;

            let newPos = 0;
            for (let i = 0; i < deck.show; i += 1) {
                if (!$(`.card[data-pos="${newPos}"]`).length) break;
                newPos = i;
            }

            $card.attr('data-pos', newPos);
            deck.updateCardPos($card, newPos);
        }
    }
}

import board from './board.js';
import deck from './deck.js';
import game from './game.js';

export default {
    speed: 2000, // Bot delay between each test
    solveTimeout: null,
    test: 0, // Number of bot test loops
    foundSet: false, // Set found?

    solve() {
        if (game.waiting) return;
        
        // Count tests loops
        this.test += 1;
        if (isDev) console.log(`ai solve ${this.test}`);

        // After 20 unsuccessful loops, suggest user to add 3 cards (if there are some left in stock)
        if (this.test === 20 && deck.stock.length) {
            $('aside').addClass('openable');
            $('button.secondary').removeAttr('disabled');
        }

        // Pick two cards at random
        const firstCard = deck.shown[Math.floor(Math.random() * deck.shown.length)];
        let secondCard = deck.shown[Math.floor(Math.random() * deck.shown.length)];

        // Make sure the same card has not been picked twice
        while (secondCard.id === firstCard.id) {
            secondCard = deck.shown[Math.floor(Math.random() * deck.shown.length)];
        }

        // Find corresponding third card
        const target = this.findThird(firstCard, secondCard);

        // Find corresponding third card ID
        const targetID = deck.findCardID(target);

        // Check if third card is on the table
        deck.shown.forEach(card => {
            if (card.id === targetID) { // Bot found a set!
                // Display valid set, move it away, increment points, add a new set
                board.validSet([firstCard.id, secondCard.id, targetID], 'bot');

                // Stop bot tests
                this.foundSet = true;

                // Change "Set" button text
                $('button.main').text('Too late!').attr('disabled', true);
            }
        });

        // This test didn't work, launch a new one
        if (!this.foundSet) this.solveTimeout = setTimeout(() => this.solve(), this.speed);
    },

    // Pause AI
    pause() {
        if (isDev) console.log('ai pause');
        clearTimeout(this.solveTimeout);
    },

    // Resume AI
    resume() {
        if (isDev) console.log('ai resume');

        this.test = 0;
        this.foundSet = false;

        // have ai check each time it resumes if game should end; this logic used to be in board.js before card draw
        let numValidSets = this.findValidSets().length
        if (isDev)  console.log(`ai sets found: ${numValidSets}, cards left: ${deck.stock.length}`);
        if (numValidSets === 0 && deck.stock.length === 0) {
            game.end();
            return;
        }

        // Launch bot
        setTimeout(() => {
            if (!game.waiting) this.solve();
        }, this.speed);
    },

    /**
     * Find the corresponding third card for two given cards
     * @param  {Object} firstCard  first card parameters
     * @param  {Object} secondCard second card parameters
     * @return {Object}            third card parameters (without ID)
     */
    findThird(firstCard, secondCard) {
        const target = {};

        // Test for shape
        if (firstCard.shape === secondCard.shape) {
            // First two cards have the same shape, the third one should as well
            target.shape = firstCard.shape;
        } else {
            // First two cards have different shapes, the third one should have the third shape
            target.shape = 3 - firstCard.shape - secondCard.shape;
        }

        // Test for color (same as above)
        if (firstCard.color === secondCard.color) {
            target.color = firstCard.color;
        } else {
            target.color = 3 - firstCard.color - secondCard.color;
        }

        // Test for symbols quantity (same as above)
        if (firstCard.qty === secondCard.qty) {
            target.qty = firstCard.qty;
        } else {
            target.qty = 3 - firstCard.qty - secondCard.qty;
        }

        // Test for fill pattern (same as above)
        if (firstCard.fill === secondCard.fill) {
            target.fill = firstCard.fill;
        } else {
            target.fill = 3 - firstCard.fill - secondCard.fill;
        }

        return target;
    },

    findValidSets() {
        const sets = [];
        const shown = deck.shown;
        
        for (let i = 0; i < deck.shown.length - 2; i += 1) {
            for (let j = i + 1; j < deck.shown.length; j += 1) {
                const third = this.findThird(shown[i], shown[j]);
                const thirdID = deck.findCardID(third);
                if (shown.some(d => d.id === thirdID)) {
                    const set = [shown[i].id, shown[j].id, thirdID].sort((a, b) => a < b ? -1 : 1);
                    if (!sets.some(d => JSON.stringify(d) === JSON.stringify(set))) sets.push(set);
                }
            }
        }

        return sets;
    }
}

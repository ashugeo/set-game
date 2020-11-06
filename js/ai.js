import board from './board.js';
import deck from './deck.js';
import game from './game.js';

export default {
    speed: 2000, // Bot delay between each test
    solveTimeout: null,
    test: 0, // Number of bot test loops
    foundSet: false, // Set found?

    init() {
        // Launch bot after 2 seconds
        setTimeout(() => {
            if (!game.waiting) this.solve();
        }, game.delay['start-bot']);
    },

    solve() {
        if (game.waiting) return;
        
        // Count tests loops
        this.test += 1;
        // console.log(`test ${this.test}`);

        // After 20 unsuccessful loops, suggest user to add 3 cards
        if (this.test === 20) $('button.secondary').removeAttr('disabled');

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
    }
}
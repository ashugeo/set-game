export default {
    speed: 1000, // Bot delay between each test
    solveTimeout: null,
    test: 0, // Number of bot test loops
    foundSet: false, // Set found?

    solve() {
        // Count tests loops
        test += 1;
        console.log('test ' + test);

        // After 30 unsuccessful loops, suggest user to add 3 cards
        if (test === 3) showAddThree();

        // Pick two cards at random
        let firstCard = shown[Math.floor(Math.random()*shown.length)];
        let secondCard = shown[Math.floor(Math.random()*shown.length)];

        // Make sure the same card has not been picked twice
        while (secondCard === firstCard) {
            secondCard = shown[Math.floor(Math.random()*shown.length)];
        }

        // Find corresponding third card
        let target = findThird(firstCard, secondCard);

        // Find corresponding third card ID
        let targetID = findCardID(target);

        // Check if third card is on the table
        shown.forEach(card => {
            if (card.id === targetID) { // Bot found a set!
                // Display valid set, move it away, increment points, add a new set
                validSet([firstCard.id, secondCard.id, targetID], 'bot');

                // Stop bot tests
                this.foundSet = true;

                // Change "Set" button text
                $('.set-button').text('Too late!').addClass('disabled');
            }
        });

        // This test didn't work, launch a new one
        if (!this.foundSet) solveTimeout = setTimeout(() => solve(), speed);
    },

    /**
     * Find the corresponding third card for two given cards
     * @param  {Object} firstCard  first card parameters
     * @param  {Object} secondCard second card parameters
     * @return {Object}            third card parameters (without ID)
     */
    findThird(firstCard, secondCard) {
        let target = {};

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
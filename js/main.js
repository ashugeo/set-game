import ai from './ai.js';
import deck from './deck.js';
import clock from './clock.js';

$(document).ready(() => {
    deck.generateCards();
    start();
});

$(document).on('click', '.set-button', () => {
    userSet();
});

$(document).on('keydown', (e) => {
    // User pressed space bar, same as clicking "Set" button
    if (e.which === 32) {
        userSet();
        clearTimeout(solveTimeout);
    }
});

/**
* Start the game
*/
function start() {
    deck.start();
    
    // Launch bot after 2 seconds
    setTimeout(() => {
        if (!game.waiting) ai.solve();
    }, 2000);
}

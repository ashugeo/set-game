import ai from './ai.js';
import deck from './deck.js';
import user from './user.js';

$(document).ready(() => {
    deck.init();
    user.init();
    // ai.init();
});
import ai from './ai.js';
import deck from './deck.js';
import sound from './sound.js';
import user from './user.js';

$(document).ready(() => {
    deck.init();
    sound.init();
    user.init();
    ai.init();
});
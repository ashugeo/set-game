import ai from './ai.js';
import board from './board.js';
import clock from './clock.js';
import deck from './deck.js';
import game from './game.js';
import user from './user.js';

$(document).ready(() => {
    deck.init();
    user.init();
    ai.init();
});
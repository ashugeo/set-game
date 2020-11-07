import ai from './ai.js';
import deck from './deck.js';
import sound from './sound.js';
import user from './user.js';

$(document).on('click', '.modes .main', () => {
    $('main').fadeOut(1000);
    setTimeout(() => {
        $('main').empty().show();

        start();
    }, 1200);
})

function start() {
    deck.init();
    sound.init();
    user.init();
    ai.init();
}
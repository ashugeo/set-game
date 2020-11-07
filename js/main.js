import ai from './ai.js';
import deck from './deck.js';
import sound from './sound.js';
import user from './user.js';

$(document).ready(() => {
    for (let y = -1; y < 11; y += 1) {
        for (let x = -1; x < 11; x += 1) {

            const shape = Math.floor(Math.random() * 3) + 1;
            const fill = Math.floor(Math.random() * 3);

            const $template = $(`.shapes svg:nth-child(${shape})`);
            const $shape = $('<div>', { class: `f${fill}` });

            $shape.css({
                left: `${(x + Math.random() / 3) * 10}%`,
                top: `${(y + Math.random() / 3) * 10}%`,
                transform: `rotate(${Math.floor(Math.random() * 180) - 90}deg)`,
                opacity: Math.random() / 10 + .05
            });

            $shape.append($template.clone());

            $('main .background').append($shape);
        }
    }
});

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
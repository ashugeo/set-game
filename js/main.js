import ai from './ai.js';
import controls from './controls.js';
import deck from './deck.js';
import sound from './sound.js';
import tutorial from './tutorial.js';
import ui from './ui.js';
import user from './user.js';

$(document).ready(() => {
    controls.init();
    sound.init();
    ui.init();

    if (location.href.includes('#about')) $('.about').removeClass('hidden');
});

$(document).one('click', '.modes .main', () => {
    $('main').fadeOut(500);
    $('aside').addClass('visible');

    setTimeout(() => {
        const html = `<div class="pause">
            <div class="content">
                <h2>Game paused</h2>
                <button class="primary">Resume</button>
            </div>
        </div>`;

        $('main').empty().html(html).show();

        start();
    }, 1200);
});

function start() {
    tutorial.init();

    if (localStorage.getItem('tutorial') === 'false') {
        $('.controls .help').removeClass('hidden');
        deck.init();
        user.init();
        ai.init();
    } else {
        setTimeout(() => tutorial.show(), 1000);
    }
}
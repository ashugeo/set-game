import controls from './controls.js';
import game from './game.js';
import sound from './sound.js';
import ui from './ui.js';

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

        game.init();
    }, 1200);
});
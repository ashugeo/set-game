import sound from './sound.js';
import tutorial from './tutorial.js';

export default {
    init() {
        $(document).on('click', '.controls .sound', () => {
            sound.on = !sound.on;
        
            if (sound.on) {
                $('.fa-volume-up').removeClass('hidden');
                $('.fa-volume-off').addClass('hidden');
                sound.play('click');
            } else {
                $('.fa-volume-off').removeClass('hidden');
                $('.fa-volume-up').addClass('hidden');
            }
        });
        
        $(document).on('click', '.controls .help', () => {
            if ($('.tutorial').is(':not(.hidden)')) return;
            tutorial.show();
        });
        
        $(document).on('click', '.controls .see-about', () => {
            $('.about').removeClass('hidden');
            history.pushState(null, null, '#about');
        });
        
        $(document).on('click', '.about, .about button', () => {
            $('.about').addClass('hidden');
            history.pushState(null, null, '/');
        });
        
        $(document).on('keydown', e => {
            if (e.which === 27) $('.about').addClass('hidden');
            history.pushState(null, null, '/');
        });
        
        $(document).on('click', '.about .content', e => e.stopPropagation());

        $(document).on('click', '.see-palettes', () => {
            $('.palettes').toggleClass('hidden');
        });

        $(document).on('click', '.palettes li', e => {
            $('.palettes li.selected').removeClass('selected');
            $(e.currentTarget).addClass('selected');

            let colors;
            if ($(e.currentTarget).hasClass('custom')) {
                $('.palettes div.custom').removeClass('hidden');
                colors = $('.palettes input[type="color"]').toArray().map(d => $(d).val());
            } else {
                $('.palettes div.custom').addClass('hidden');
                colors = $(e.currentTarget).find('div').toArray().map(d => $(d).css('background-color'));
            }

            document.documentElement.style.setProperty('--color-0', colors[0]);
            document.documentElement.style.setProperty('--color-1', colors[1]);
            document.documentElement.style.setProperty('--color-2', colors[2]);
        });

        $(document).on('input', '.palettes input[type="color"]', () => {
            const colors = $('.palettes input[type="color"]').toArray().map(d => $(d).val());

            $('.palettes li.custom div').each((i, el) => $(el).css('background-color', colors[i]));

            document.documentElement.style.setProperty('--color-0', colors[0]);
            document.documentElement.style.setProperty('--color-1', colors[1]);
            document.documentElement.style.setProperty('--color-2', colors[2]);
        });
    }
}
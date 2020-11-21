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
            $('.palettes').addClass('hidden');
            $('.about').removeClass('hidden');
            history.pushState(null, null, '#about');
        });
        
        $(document).on('click', '.about, .about button', () => {
            $('.about').addClass('hidden');
            history.pushState(null, null, '/');
        });
        
        $(document).on('keydown', e => {
            if (e.which === 27) {
                $('.about').addClass('hidden');
                history.pushState(null, null, '/');
            }
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

            this.setCustomColors(colors, $(e.currentTarget).hasClass('custom'));
        });

        $(document).on('input', '.palettes input[type="color"]', () => {
            const colors = $('.palettes input[type="color"]').toArray().map(d => $(d).val());
            this.setCustomColors(colors, true);
        });

        this.getCustomColors();
    },

    setCustomColors(colors, updateCustom = false) {
        if (updateCustom) {
            $('.palettes li.custom div').each((i, el) => $(el).css('background-color', colors[i]));
            $('.palettes input[type="color"]').each((i, el) => $(el).val(colors[i]));
        }

        document.documentElement.style.setProperty('--color-0', colors[0]);
        document.documentElement.style.setProperty('--color-1', colors[1]);
        document.documentElement.style.setProperty('--color-2', colors[2]);

        localStorage.setItem('colors', colors.join(','));
    },

    getCustomColors() {
        const colors = localStorage.getItem('colors');
        if (colors) this.setCustomColors(colors.split(','), true);
    }
}
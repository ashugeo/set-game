import game from './game.js';
import sound from './sound.js';
import toast from './toast.js';
import tutorial from './tutorial.js';

export default {
    init() {
        console.log('controls init');

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
            game.pause(false);
            tutorial.show();
        });
        
        $(document).on('click', '.controls .see-about', () => {
            $('.palettes').addClass('hidden');
            $('.about').removeClass('hidden');
            history.pushState(null, null, '#about');

            if (game.started) game.pause();
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
            if (game.started) game.pause();
            return false;
        });

        $(document).on('click', () => {
            $('.palettes').addClass('hidden');
        });

        $(document).on('click', '.palettes', e => {
            e.stopPropagation();
        });

        $(document).on('click', '.palettes li', e => {
            $('.palettes li.selected').removeClass('selected');
            $(e.currentTarget).addClass('selected');

            localStorage.setItem('palette', $(e.currentTarget).index());

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

        $(document).on('click', '.palettes .reset', () => {
            const colors = ['#cccccc', '#cccccc', '#cccccc'];
            this.setCustomColors(colors, true);
        });

        $(document).on('click', '.palettes .share', () => {
            const url = `${location.href}#palette=${localStorage.getItem('colors').replace(/[\#\|]/g, '')}`;

            navigator.clipboard.writeText(url).then(() => {
                const html = `<p><strong>Link to palette copied in clipboard!</strong></p>
                <p class="small">Paste it anywhere to share it with friends</p>`;
                const icon = 'far fa-clipboard';
                toast.show('palette', html, icon);
            });
        });

        this.getCustomColors();
        this.getPalette();

        if (location.hash.includes('#palette')) {
            const colors = location.hash.split('#palette=')[1].split('&')[0].match(/.{6}/g).map(d => `#${d}`);
            if (colors.length === 3 && colors.every(d => d.match(/^#[a-f0-9]{6}$/i) !== null)) {
                this.setCustomColors(colors, true);

                const html = `<p><strong>Palette successfully loaded!</strong></p>
                <p class="small">Wow, shiny colors! ${colors.map(d => `<span class="color" style="background-color: ${d}"></span>`).join('')}</p>`;
                const icon = 'fas fa-palette';
                toast.show(null, html, icon);
            } else {
                const html = `<p><strong>Couldn't load palette</strong></p>
                <p class="small">Something was wrong with these colors codes</p>`;
                const icon = 'fas fa-times';
                toast.show(null, html, icon);
            }

            history.pushState(null, null, '/');
        }
    },

    setCustomColors(colors, updateCustom = false) {
        if (updateCustom) {
            $('.palettes li.custom div').each((i, el) => $(el).css('background-color', colors[i]));
            $('.palettes input[type="color"]').each((i, el) => $(el).val(colors[i]));
            localStorage.setItem('colors', colors.join('|'));
        }

        for (const [i, color] of colors.entries()) {
            document.documentElement.style.setProperty(`--color-${i}`, color);
        }
    },

    getCustomColors() {
        const colors = localStorage.getItem('colors');
        if (colors) this.setCustomColors(colors.split('|'), true);
    },

    getPalette() {
        const palette = localStorage.getItem('palette');
        if (!palette) return;

        const $palette = $('.palettes ul li').eq(parseInt(palette));
        $('.palettes li.selected').removeClass('selected');
        $palette.addClass('selected');
        if ($palette.hasClass('custom')) $('.palettes div.custom').removeClass('hidden');

        const colors = $palette.find('div').toArray().map(d => $(d).css('background-color'));
        this.setCustomColors(colors);
    }
}
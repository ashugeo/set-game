import ai from './ai.js';
import deck from './deck.js';
import sound from './sound.js';
import user from './user.js';
import tutorial from './tutorial.js';

$(document).ready(() => {
    sound.init();
});

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
});

$(document).one('click', '.modes .main', () => {
    $('main').fadeOut(800);
    $('aside').addClass('visible');

    setTimeout(() => {
        $('main').empty().show();

        start();
    }, 1200);
});

$(document).on('mouseenter', '.mode > div', e => {
    if (e.originalEvent.sourceCapabilities.firesTouchEvents) return;

    const $el = $(e.currentTarget);
    setTimeout(() => $el.css('transition', 'none'), 100);
    $el.parent('.mode').css('transform', 'translateZ(0) scale(1.03)');
});

$(document).on('mousemove', '.mode > div', e => {
    if (e.originalEvent.sourceCapabilities.firesTouchEvents) return;

    const $el = $(e.currentTarget);

    var ax = (e.pageX - $el.offset().left - $el.outerWidth() / 2) / 20;
    var ay = -(e.pageY - $el.offset().top - $el.outerHeight() / 2) / 20;

    $el.css('transform', `rotateY(${ax}deg) rotateX(${ay}deg)`);
});

$(document).on('mouseleave', '.mode > div', e => {
    if (e.originalEvent.sourceCapabilities.firesTouchEvents) return;

    const $el = $(e.currentTarget);
    $el.parent('.mode').css('transform', '');
    $el.css({
        transition: 'transform .2s ease',
        transform: ''
    });
});

$(document).on('click', 'aside', e => {
    $(e.currentTarget).toggleClass('open');
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
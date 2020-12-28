export default {
    init() {
        const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

        const disableAnimation = isTouchScreen || isFirefox;

        $(document).on('mouseenter', '.mode > div', e => {
            if (disableAnimation) return;

            const $el = $(e.currentTarget);
            setTimeout(() => $el.css('transition', 'none'), 100);
            $el.parent('.mode').css('transform', 'translateZ(0) scale(1.03)');
        });
        
        $(document).on('mousemove', '.mode > div', e => {
            if (disableAnimation) return;

            const $el = $(e.currentTarget);
        
            const ax = (e.pageX - $el.offset().left - $el.outerWidth() / 2) / 15;
            const ay = -(e.pageY - $el.offset().top - $el.outerHeight() / 2) / 15;
        
            $el.css('transform', `rotateY(${ax}deg) rotateX(${ay}deg)`);
        });
        
        $(document).on('mouseleave', '.mode > div', e => {
            if (disableAnimation) return;

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
    }
}
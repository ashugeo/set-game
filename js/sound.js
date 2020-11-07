import clock from './clock.js';

export default {
    sounds: {},
    on: true,

    init() {
        this.sounds['1'] = new Howl({ src: ['/sound/01.wav'], volume: .5 });
        this.sounds['2'] = new Howl({ src: ['/sound/02.wav'], volume: .5 });
        this.sounds['3'] = new Howl({ src: ['/sound/03.wav'], volume: .5 });
        this.sounds['4'] = new Howl({ src: ['/sound/04.wav'], volume: .5 });
        this.sounds['click'] = new Howl({ src: ['/sound/click.wav'], volume: .5 });
        this.sounds['tick'] = new Howl({ src: ['/sound/tick.mp3'] });
        this.sounds['tock'] = new Howl({ src: ['/sound/tock.mp3'] });
    },

    play(id) {
        if (!this.on) return;
        if ((id === 'tick' || id === 'tock') && !clock.ticking) return;

        this.sounds[id].play();
    }
}
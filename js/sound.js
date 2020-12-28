export default {
    sounds: {},
    on: true,

    init() {
        if (isDev) console.log('sound init');

        Howler.volume(.5);
        
        this.sounds['1'] = new Howl({ src: ['/sound/01.wav'] });
        this.sounds['2'] = new Howl({ src: ['/sound/02.wav'] });
        this.sounds['3'] = new Howl({ src: ['/sound/03.wav'] });
        this.sounds['4'] = new Howl({ src: ['/sound/04.wav'] });
        this.sounds['click'] = new Howl({ src: ['/sound/click.wav'] });
    },

    play(id) {
        if (!this.on) return;

        this.sounds[id].play();
    }
}
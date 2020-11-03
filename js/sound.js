export default {
    sounds: {},

    init() {
        this.sounds['1'] = new Howl({ src: ['/sound/01.wav'] });
        this.sounds['2'] = new Howl({ src: ['/sound/02.wav'] });
        this.sounds['3'] = new Howl({ src: ['/sound/03.wav'] });
        this.sounds['4'] = new Howl({ src: ['/sound/04.wav'] });
    },

    play(id) {
        this.sounds[id].play();
    }
}
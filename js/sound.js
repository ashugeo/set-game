export default {
    sounds: {},
    on: true,

    init() {
        this.sounds['1'] = new Howl({ src: ['/sound/01.wav'], volume: .5 });
        this.sounds['2'] = new Howl({ src: ['/sound/02.wav'], volume: .5 });
        this.sounds['3'] = new Howl({ src: ['/sound/03.wav'], volume: .5 });
        this.sounds['4'] = new Howl({ src: ['/sound/04.wav'], volume: .5 });
        this.sounds['click'] = new Howl({ src: ['/sound/click.wav'], volume: .5 });
    },

    play(id) {
        if (!this.on) return;
        this.sounds[id].play();
    }
}
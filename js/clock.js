import ai from './ai.js';
import game from './game.js';
import sound from './sound.js';

export default {
    timeout: null,
    ticking: false,

    /**
     * Give the user 10 seconds to select three cards
     * @param  {int} t current clock state
     */
    countdown(t) {
        if (t === 10) this.ticking = true;

        if (t > 0) {
            if (t > 6) {
                if (t % 2 === 0) sound.play('tick');
                else sound.play('tock');
            } else if (t > 2) {
                sound.play('tick');
                setTimeout(() => sound.play('tock'), 500);
            } else {
                sound.play('tick');
                setTimeout(() => sound.play('tock'), 250);
                setTimeout(() => sound.play('tick'), 500);
                setTimeout(() => sound.play('tock'), 750);
            }
        }

        if (t === 0) { // 10 seconds have passed
            $('button.main').html('Too late!').removeClass('waiting');

            setTimeout(() => {
                // Unselect
                $('.card.selected').removeClass('selected');
                
                // User can play again
                $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled').removeClass('waiting');

                // Launch bot tests again
                ai.init();
            }, game.delay['restart']);
        } else {
            // Display seconds remaining
            $('button.main .count').html(t);

            // Decrement seconds
            t -= 1;

            // Check again in a second
            this.timeout = setTimeout(() => this.countdown(t), 1000);
        }
    }
}
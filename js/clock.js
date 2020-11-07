import ai from './ai.js';
import game from './game.js';

export default {
    timeout: null,

    /**
     * Give the user 10 seconds to select three cards
     * @param  {int} t current clock state
     */
    countdown(t) {
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
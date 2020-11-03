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
            $('.countdown').remove();
            $('.set-button').text('Too late!');

            setTimeout(() => {
                // Unselect
                $('.card.selected').removeClass('selected');
                
                // User can play again
                $('.set-button').text('Set !').removeClass('disabled');

                // Launch bot tests again
                game.waiting = false;
                ai.foundSet = false;
                ai.solve();
            }, 2000);
        } else {
            // Display seconds remaining
            $('.countdown-number').text(t);

            // Decrement seconds
            t -= 1;

            // Check again in a second
            this.timeout = setTimeout(() => this.countdown(t), 1000);
        }
    }
}
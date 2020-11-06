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
            $('button.main').html('Too late!');

            setTimeout(() => {
                // Unselect
                $('.card.selected').removeClass('selected');
                
                // User can play again
                $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled');

                // Launch bot tests again
                game.waiting = false;
                ai.foundSet = false;
                ai.solve();
            }, game.delay['restart']);
        } else {
            // Display seconds remaining
            // $('.countdown-number').text(t);
            $('button.main').html(`${t}<span>Click 3 cards</span>`);

            // Decrement seconds
            t -= 1;

            // Check again in a second
            this.timeout = setTimeout(() => this.countdown(t), 1000);
        }
    }
}
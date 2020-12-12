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

                // Withdraw one point
                game.updatePoints(-1, 'user');
    
                // Move a Set away
                let userCards = $('.user .sets-wrapper .card:not(.away)').toArray();
                userCards = userCards.slice(Math.max(userCards.length - 3, 0)).reverse();
                userCards.forEach((el, i) => setTimeout(() => $(el).addClass('away'), i * 100));

                $('main').removeClass('waiting');
                
                game.unfreeze();
            }, game.delay['resume']);
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
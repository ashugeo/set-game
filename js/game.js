import ai from './ai.js';

export default {
    started: false,
    waiting: false, // Game paused?
    points: { // Points counter
        'bot': 0,
        'user': 0
    },
    delay: { // Game animations delays
        'add-cards': 1500,
        'resume': 1000,
        'show-bot-set': 3000,
        'show-user-set': 2000,
        'show-user-fail': 3000,
        'start-bot': 5000
    },

    updatePoints(point, to) {
        if (point === 1) {
            // Add a point
            this.points[to] += 1;
        } else if (point === -1 && this.points[to] !== 0) {
            // Withdraw a point (if not already at 0)
            this.points[to] -= 1;

            // Take upper set away
            // moveSetAway([], 'none')
        }

        // Update text
        $(`.${to} p.score`).text(this.points[to] ? `${this.points[to]} set${this.points[to] > 1 ? 's' : ''}` : 'No set yet');
    },

    pause() {
        $('main').addClass('paused');
    
        this.waiting = true;
        ai.pause();
    },

    resume() {
        $('main').removeClass('paused');
        
        this.unfreeze();
        ai.resume();
    },

    unfreeze() {
        this.waiting = false;

        // User can play again
        $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled').removeClass('waiting');
    } 
}
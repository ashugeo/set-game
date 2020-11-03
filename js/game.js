import ai from './ai.js';
import deck from './deck.js';

export default {
    waiting: false, // Game paused?
    points: { // Points counter
        'bot': 0,
        'user': 0
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
    }
}
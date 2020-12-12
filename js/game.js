import ai from './ai.js';
import board from './board.js';
import deck from './deck.js';
import sound from './sound.js';
import tutorial from './tutorial.js';
import user from './user.js';

export default {
    delay: { // Game animations delays
        'add-cards': 1500,
        'resume': 1000,
        'show-bot-set': 3000,
        'show-user-set': 2000,
        'show-user-fail': 3000,
        'start-bot': 5000
    },

    init() {
        console.log('game init');

        this.reset();

        deck.init();
        tutorial.init();
        user.init();
    
        if (localStorage.getItem('tutorial') === 'false') {
            setTimeout(() => this.start(), 1000);
        } else {
            setTimeout(() => tutorial.show(), 1000);
        }
    },

    start() {
        console.log('game start');

        $('.controls .help').removeClass('hidden');
        this.started = true;

        deck.firstDeal();

        setTimeout(() => {
            this.waiting = false;
            $('button.main').removeAttr('disabled');
            ai.resume();
        }, 3000);
    },

    reset() {
        console.log('game reset');

        this.started = false;
        this.waiting = true;
        this.sets = {
            'bot': 0,
            'user': 0,
        };
        this.errors = {
            'bot': 0,
            'user': 0,  
        };
        this.points = {
            'bot': 0,
            'user': 0
        };
    },

    updatePoints(point, to) {
        if (point === 1) {
            // Add a point
            this.sets[to] += 1;
            this.points[to] += 1;
        } else if (point === -1 && this.points[to] !== 0) {
            // Withdraw a point (if not already at 0)
            this.points[to] -= 1;
            this.errors[to] += 1;
        }

        // Update text
        $(`.${to} p.score`).text(this.points[to] ? `${this.points[to]} set${this.points[to] > 1 ? 's' : ''}` : 'No set yet');
    },

    pause(showPause = true) {
        console.log('game pause');

        if (showPause) $('main').addClass('paused');
    
        this.waiting = true;
        ai.pause();
    },

    resume() {
        console.log('game resume');
        if (!this.started) return this.start();

        $('main').removeClass('paused');
        
        this.unfreeze();
    },

    unfreeze() {
        console.log('game unfreeze');

        this.waiting = false;

        // User can play again
        $('button.main').html('Set<span>or press Space</span>').removeAttr('disabled').removeClass('waiting');

        ai.resume();
    },

    end() {
        console.log('game end');
        
        this.started = false;
        this.waiting = true;
        
        ai.pause();

        $('aside').removeClass('visible');
        $('main .card').fadeOut(1000, () => $('main .card').remove());

        setTimeout(() => {
            $('aside .score').html('No set yet');
            $('aside .sets-wrapper').empty();
            $('aside button.main').html('Set<span>or press Space</span>');
        }, 2000);
        
        const won = this.points.user > this.points.bot;

        const html = `<div class="end hidden">
            <div class="content">
                <h3>Game ended</h3>
                <h2 class="hidden">${won ? 'Well done!' : 'Maybe next time'}</h2>

                <div class="row">
                    <div>
                        <span class="icon hidden">${won ? '' : '<i class="fas fa-crown"></i>'}</span>
                        <h4>Bot score</h4>
                        <h1 class="bot" data-to="${this.points.bot}">·</h1>
                        <p>Sets found: ${this.sets.bot}</p>
                    </div>

                    <div>
                        <span class="icon hidden">${won ? '<i class="fas fa-crown"></i>' : ''}</span>
                        <h4>Your score</h4>
                        <h1 class="user" data-to="${this.points.user}">·</h1>

                        <p>Sets found: <span class="${this.sets.user ? 'valid' : 'error'}">${this.sets.user}</span></p>
                        <p>Errors: <span class="${this.errors.user ? 'error' : 'valid'}">${this.errors.user ? `-${this.errors.user}` : this.errors.user}</span></p>
                    </div>
                </div>

                <button class="primary hidden">Play again</button>
                <a href="/"><button class="tertiary hidden">Back to homepage</button></a>
            </div>
        </div>`;

        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(2000 / (1000 / 60));

        const easeOutQuad = t => t * ( 2 - t );

        const count = el => {
            let frame = 0;
            const countTo = parseInt($(el).attr('data-to'), 10);
            const counter = setInterval(() => {
                frame++;
                const progress = easeOutQuad(frame / totalFrames);
                const currentCount = Math.round( countTo * progress );

                if (parseInt(el.innerHTML, 10) !== currentCount) {
                    sound.play('click');
                    el.innerHTML = currentCount;
                }

                if (frame === totalFrames) clearInterval(counter);
            }, frameDuration );
        };

        const $end = $(html);
        $('main').append($end);
        
        $('.end button.primary').one('click', () => {
            $('.end').addClass('hidden');
            setTimeout(() => $('.end').remove(), 500);
            $('aside').addClass('visible');

            this.reset();
            board.reset();
            deck.reset();
            
            setTimeout(() => this.start(), 1000);
        });
        
        setTimeout(() => {
            $end.removeClass('hidden');

            setTimeout(() => {
                count($('h1.bot')[0]);
                
                setTimeout(() => {
                    count($('h1.user')[0]);

                    setTimeout(() => {
                        if (won) sound.play('4');
                        else sound.play('3');

                        $('.end h2, .end .icon').removeClass('hidden');
                        setTimeout(() => $('.end button').removeClass('hidden'), 1000);
                    }, 2500);
                }, 2000);
            }, 1000);
        }, 2000);
    }
}
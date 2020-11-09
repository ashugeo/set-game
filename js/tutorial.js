import ai from './ai.js';
import deck from './deck.js';
import game from './game.js';
import user from './user.js';

export default {
    nth: 0,
    screens: [
        `<div class="content">
            <h3>Tutorial (1/4)</h3>
            <h2>Welcome to a game of Set!</h2>
            <p>This game has 81 uniques cards, each with four different features: the color, shape, number and filling of the symbols they contain.</p>

            <div class="row">
                <div class="box">
                    <h4>Color</h4>
                    <div class="row">
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Purple</span>
                        </div>
                        <div>
                            <div class="card c2 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Green</span>
                        </div>
                        <div>
                            <div class="card c0 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Red</span>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <h4>Shape</h4>
                    <div class="row">
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Tilde</span>
                        </div>
                        <div>
                            <div class="card c2 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                            <span>Diamond</span>
                        </div>
                        <div>
                            <div class="card c0 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                </div>
                            </div>
                            <span>Pill</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="box">
                    <h4>Number</h4>
                    <div class="row">
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>1</span>
                        </div>
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>2</span>
                        </div>
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>3</span>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <h4>Filling</h4>
                    <div class="row">
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Solid</span>
                        </div>
                        <div>
                            <div class="card c1 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Stripped</span>
                        </div>
                        <div>
                            <div class="card c1 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                            <span>Outlined</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row buttons">
                <button class="primary">Next</button>
            </div>
            <button class="tertiary">Skip the tutorial</button>
        </div>`,

        `<div class="content">
            <h3>Tutorial (2/4)</h3>
            <h2>Find as many Sets as you can</h2>
            <p>A Set is 3 cards where each individual feature is either all the same, or all different. Whenever you find one, click on the "Set" button, then select the 3 cards. The player with the most Sets at the end wins!</p>

            <p>Here are a few examples of a Set.</p>

            <div class="row">
                <div class="box valid">
                    <div class="row">
                        <div>
                            <div class="card c1 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c1 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Same color, same shape,<br>same number, different filling.</span>
                </div>
                <div class="box valid">
                    <div class="row">
                        <div>
                            <div class="card c1 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c2 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c0 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Different color, same shape,<br>different number, same filling.</span>
                </div>
            </div>
            <div class="row">
                <div class="box valid">
                    <div class="row">
                        <div>
                            <div class="card c2 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c0 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c1 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Different color, different shape,<br>same number, different filling.</span>
                </div>
                <div class="box valid">
                    <div class="row">
                        <div>
                            <div class="card c1 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c0 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c2 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Different color, same shape,<br>different number, different filling.</span>
                </div>
            </div>

            <div class="row buttons">
                <button class="secondary">Previous</button>
                <button class="primary">Next</button>
            </div>
            <button class="tertiary">Skip the tutorial</button>
        </div>`,

        `<div class="content">
            <h3>Tutorial (3/4)</h3>
            <h2>Don't be too greedy!</h2>
            <p>When you press the "Set" button, you have 10 seconds to pick it up. Watch out: if you can't find one, or if you pick 3 cards that don't make a Set, you'll lose a point… Oh, and the AI is never wrong!</p>

            <p>Just to make sure you got this, here are a couple examples of 3 cards that <strong>don't</strong> make a Set.</p>

            <div class="row">
                <div class="box invalid">
                    <div class="row">
                        <div>
                            <div class="card c1 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c0 f0">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c2 f2">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#tilde"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Different color, same shape and number, but two cards have the same filling.</span>
                </div>
                <div class="box invalid">
                    <div class="row">
                        <div>
                            <div class="card c1 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c2 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                    <svg viewBox="0 0 12 8"><use xlink:href="#pill"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card c0 f1">
                                <div class="card-inner">
                                    <svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>Different color and number, same filling, but two cards have the same shape.</span>
                </div>
            </div>

            <div class="row buttons">
                <button class="secondary">Previous</button>
                <button class="primary">Next</button>
            </div>
            <button class="tertiary">Skip the tutorial</button>
        </div>`,

        `<div class="content">
            <h3>Tutorial (4/4)</h3>
            <h2>Ready?</h2>
            <p>That's it, you know the rules! The game starts with 12 cards. There is a small chance* that no Set exists on the board, in which case you'll be able to request 3 additional cards after a little while.</p>

            <p>The AI has three difficulty levels: the harder, the faster it is!<br><strong>If you are ready, click on Start and play against the computer!</strong></p>

            <p class="small">* There's about a 3% chance that no Set exists within 12 cards, and it gets down to a 0.04% chance within 15 cards.</p>

            <div class="row buttons">
                <button class="secondary">Previous</button>
                <button class="primary">Start</button>
            </div>
        </div>`
    ],

    init() {
        // Next button
        $(document).on('click', '.tutorial button.primary', () => {
            if (this.nth === 3) {
                this.start();
            } else {
                const html = this.screens[++this.nth];
                $('.tutorial').html(html).scrollTop(0);
            }
        });

        // Previous button
        $(document).on('click', '.tutorial button.secondary', () => {
            const html = this.screens[--this.nth];
            $('.tutorial').html(html).scrollTop(0);
        });

        // Skip tutorial
        $(document).on('click', '.tutorial button.tertiary', () => {
            this.start();
        });
    },

    show() {
        // Pause game
        clearTimeout(ai.solveTimeout);
        game.waiting = true;

        this.nth = 0;
        const html = this.screens[this.nth];

        // First screen
        if ($('.tutorial').length) {
            $('.tutorial').html(html).scrollTop(0);
            $('.tutorial').removeClass('hidden');
        } else {
            $('body').append(`<div class="tutorial hidden">${html}</div>`);
            setTimeout(() => $('.tutorial').removeClass('hidden'), 100);
        }
    },

    start() {
        $('.tutorial').addClass('hidden');
        $('.controls .help').removeClass('hidden');
    
        setTimeout(() => {
            if (!game.started) {
                localStorage.setItem('tutorial', 'false');
                deck.init();
                user.init();
            }

            ai.init();
        }, 1000);
    }
}
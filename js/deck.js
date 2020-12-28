import game from './game.js';
import user from './user.js';

export default {
    cards: [], // All 81 cards
    stock: [], // Cards not dealt yet
    shown: [], // Cards currently on the board
    show: 12,  // Number of cards to be shown on the board
    p: 0, // Position of the cards on the table

    init() {
        if (isDev) console.log('deck init');

        // Generate all 81 cards
        let id = 0;
        for (let shape = 0; shape < 3; shape += 1) {
            for (let color = 0; color < 3; color += 1) {
                for (let qty = 0; qty < 3; qty += 1) {
                    for (let fill = 0; fill < 3; fill += 1) {
                        this.cards.push({ shape, color, qty, fill, id });
                        id += 1;
                    }
                }
            }
        }

        this.reset();
    },

    reset() {
        if (isDev) console.log('deck reset');

        this.shown = [];
        this.show = 12;
        this.p = 0;

        // Copy all cards array to stock arrays
        this.stock = this.cards.slice();
    },

    /**
     * Display first 12 cards
     */ 
    firstDeal() {
        for (let i = 0; i < this.show; i += 1) {
            setTimeout(() => this.randomCard(), i * 200);
        }
    },

    /**
     * Generate a random card
     * @param  {int} pos position of the card on the table
     */
    randomCard(pos) {
        // Select a card at random among those not dealt yet
        const rand = Math.floor(Math.random() * this.stock.length);
        const card = this.stock[rand];

        // Remove this card from stock array and add it to currently-displayed array
        if (this.stock.indexOf(card) > -1) {
            this.stock.splice(this.stock.indexOf(card), 1);
            this.shown.push(card);
            this.displayCard(card, pos);
        }
    },

    /**
     * Find card ID depending on its parameters
     * @param  {Object} target target card parameters
     * @return {int}           ID of target card
     */
    findCardID(target) {
        return this.cards.find(card =>
            target.shape === card.shape &&
            target.color === card.color &&
            target.qty === card.qty &&
            target.fill === card.fill
        ).id;
    },

    /**
     * Remove a card from currently-displayed array
     * @param  {int} id ID of the card to remove
     */
    removeCurrentByID(id) {
        this.shown.forEach((card) => {
            if (card.id === id) {
                this.shown.splice(this.shown.indexOf(card), 1);
            }
        });
    },

    /**
     * Generate a card div and append it to main
     * @param  {Object} card card parameters
     * @param  {int}    pos  position of the card on the table
     */
    displayCard(card, pos) {
        // No pos parameter given, auto-increment
        if (pos === undefined) pos = this.p++;

        // Generate card with id, color and fill parameters
        const $card = $('<div>', { id: card.id, class: `new card c${card.color} f${card.fill}` });

        // Create card 
        const $inner = $('<div>', { class: 'card-inner' });

        // Add slight random rotation
        $inner.css('transform', `rotate(${Math.round(Math.random() * 6) - 3}deg)`);

        // Add position as data attribute
        $card.attr('data-pos', pos);

        this.updateCardPos($card, pos);

        // Bind click event
        $card.on('click', () => {
            if (!game.waiting) return;
            user.clickCard($card);
        });

        // Add symbol(s)
        for (let qty = 0; qty <= card.qty; qty += 1) {
            const shape = ['tilde', 'diamond', 'pill'][card.shape];
            $inner.append(`<svg viewBox="0 0 12 8"><use xlink:href="#${shape}"></use></svg>`);
        }

        // Append inner to card
        $card.append($inner);

        // Append $card to main
        $('main').append($card);
        setTimeout(() => $card.removeClass('new'), 100);
    },

    updateCardPos($card, pos) {
        if (!pos) pos = parseInt($card.attr('data-pos'));

        const winW = $('main').outerWidth();
        const winH = $('main').outerHeight();

        let cardW;
        if (winW <= 950 || winH + 80 <= 600) cardW = 64;
        else if (winW <= 1200 || winH + 80 <= 750) cardW = 96;
        else cardW = 128;
        
        let cardH;
        if (winW <= 950 || winH + 80 <= 600) cardH = 88;
        else if (winW <= 1200 || winH + 80 <= 750) cardH = 132;
        else cardH = 176;

        let margin;
        if (winW <= 950 || winH + 80 <= 600) margin = 12;
        else if (winW <= 1200 || winH + 80 <= 750) margin = 24;
        else margin = 40;

        const padLeft = winW <= 750 ? 0 : 320;

        const cols = Math.max(this.show / 3, 4);
        const originX = padLeft + (winW - padLeft - (cols * cardW + (cols - 1) * margin)) / 2;
        const originY = (winH - (3 * cardH + 2 * margin)) / 2;

        $card.css({
            top: originY + (pos % 3) * (cardH + margin),
            left: originX + Math.floor(pos / 3) * (cardW + margin)
        });
    },

    /**
     * Display three new cards and run bot test
     */
    draw3Cards() {
        // Find spots to fill (top let to bottom right)
        const emptySpots = [...Array(this.show).keys()].filter(d => !$(`.card[data-pos="${d}"]`).length);

        // Add three new cards
        for (let i = 0; i < 3; i += 1) {
            // Set new card at first empty spot
            setTimeout(() => {
                this.randomCard(emptySpots[0]);
                emptySpots.shift();
            }, i * 100);
        }
    }
}
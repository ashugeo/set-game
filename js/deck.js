import game from './game.js';
import user from './user.js';

export default {
    cards: [], // All 81 cards
    stock: [], // Cards not dealt yet
    shown: [], // Cards currently on the board
    p: 0, // Position of the cards on the table
    emptyPos: [],

    init() {
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

        // Copy all cards array to stock arrays
        this.stock = this.cards.slice();
    
        // Display first 12 cards
        for (let i = 0; i < 12; i += 1) {
            setTimeout(() => this.randomCard(), i * 100);
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
        let targetID;
        this.cards.forEach(card => {
            if (
                target.shape === card.shape
                && target.color === card.color
                && target.qty === card.qty
                && target.fill === card.fill
            ) {
                targetID = card.id;
            }
        });
        return targetID;
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
        let $card = $('<div>', { id: card.id, class: 'new card c' + card.color + ' f' + card.fill });

        // Create card 
        const $inner = $('<div>', { class: 'card-inner' });

        // Add slight random rotation
        $inner.css('transform', `rotate(${Math.round(Math.random() * 6) - 3}deg)`);

        // Add position as data attribute
        $card.attr('data-pos', pos);

        // Set position
        if (pos < 12) {
            $card.css({
                top: Math.floor(pos / 4) * 220 + ($(window).outerHeight() - 624) / 2,
                left: (pos % 4) * 164 + ($(window).outerWidth() - 320) / 2,
            });
        } else {
            $card.css({
                top: (pos % 3) * 220 + ($(window).outerHeight() - 624) / 2,
                left: Math.floor(pos / 3) * 164 + ($(window).outerWidth() - 320) / 2
            });
        }

        // Bind click event
        $card.on('click', () => {
            if (!game.waiting) return;
            user.clickCard($card);
        });

        // Add symbol(s)
        for (let qty = 0; qty <= card.qty; qty += 1) {
            if (card.shape === 0) $inner.append('<svg viewBox="0 0 12 8"><use xlink:href="#tild"></use></svg>');
            else if (card.shape === 1) $inner.append('<svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>');
            else if (card.shape === 2) $inner.append('<svg viewBox="0 0 12 8"><use xlink:href="#oval"></use></svg>');
        }

        // Append inner to card
        $card.append($inner);

        // Append $card to main
        $('main').append($card);
        setTimeout(() => $card.removeClass('new'), 100);
    },

    /**
     * Display three new cards and run bot test
     */
    draw3Cards() {
        // Add three new cards
        for (let i = 0; i < 3; i += 1) {
            // Set new card at first empty spot
            setTimeout(() => {
                this.randomCard(this.emptyPos[0]);
                this.emptyPos.shift();
            }, i * 100);
        }
    }
}
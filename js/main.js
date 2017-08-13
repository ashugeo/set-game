let cards = [];

$(document).ready(() => {

    // Generate all cards
    for (let shape = 0; shape < 3; shape += 1) {
        for (let color = 0; color < 3; color += 1) {
            for (let qty = 0; qty < 3; qty += 1) {
                for (let fill = 0; fill < 3; fill += 1) {
                    cards.push({shape, color, qty, fill});
                }
            }
        }
    }

    // Display all cards
    cards.forEach((card) => {
        var $div = $('<div>', {class: 'card c' + card.color + ' f' + card.fill});

        for (let qty = 0; qty <= card.qty; qty += 1) {
            if (card.shape === 0) {
                $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#tild"></use></svg>');
            } else if (card.shape === 1) {
                $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>');
            } else if (card.shape === 2) {
                $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#oval"></use></svg>');
            }
        }
        $div.css('transform', 'rotate(' + Math.round(Math.random()*8 - 4) + 'deg)');
        $('body').append($div);
    });
});

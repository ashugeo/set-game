let cards = [];
let cardsLeft = [];
let currentCards = [];
let tests = 0;
let speed = 1000;

$(document).ready(() => {

    // Generate all cards
    let id = 0;
    for (let shape = 0; shape < 3; shape += 1) {
        for (let color = 0; color < 3; color += 1) {
            for (let qty = 0; qty < 3; qty += 1) {
                for (let fill = 0; fill < 3; fill += 1) {
                    cards.push({shape, color, qty, fill, id});
                    id += 1;
                }
            }
        }
    }

    start();
});

function start() {
    cardsLeft = cards.slice();
    for (let i = 0; i < 12; i += 1) {
        displayRandomCard();
    }

    setTimeout(() => {
        solve();
    }, 1000);
}

function displayAllCards() {
    cards.forEach((card) => {
        displayCard(card);
    });
}

function displayRandomCard() {
    let rand = Math.floor(Math.random()*cardsLeft.length);
    let card = cardsLeft[rand];

    if (cardsLeft.indexOf(card) > -1) {
        cardsLeft.splice(cardsLeft.indexOf(card), 1);
        currentCards.push(card);
        displayCard(card);
    }
}

function displayCard(card) {
    let $div = $('<div>', {id: card.id, class: 'card c' + card.color + ' f' + card.fill});

    for (let qty = 0; qty <= card.qty; qty += 1) {
        if (card.shape === 0) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#tild"></use></svg>');
        } else if (card.shape === 1) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>');
        } else if (card.shape === 2) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#oval"></use></svg>');
        }
    }
    // $div.append(card.id);
    // $div.css('transform', 'rotate(' + Math.round(Math.random()*8 - 4) + 'deg)');
    $('.wrapper').append($div);
}

function solve() {
    let foundSet;

    let firstCard = currentCards[Math.floor(Math.random()*currentCards.length)];

    let secondCard = currentCards[Math.floor(Math.random()*currentCards.length)];

    while (secondCard === firstCard) {
        secondCard = currentCards[Math.floor(Math.random()*currentCards.length)];
    }

    let target = findThird(firstCard, secondCard);

    let targetID = findCardID(target);

    currentCards.forEach((card) => {
        if (card.id === targetID) {
            foundSet = true;
            console.log('found set !');
            displaySet(firstCard.id, secondCard.id, targetID);
        }
    });

    if (!foundSet) {
        setTimeout(() => {
            solve(firstCard, secondCard);
        }, speed);
    }

    tests += 1;
    console.log(tests);
    if (tests === 30) {
        for (let i = 0; i < 3; i += 1) {
            displayRandomCard();
        }
        tests = 0;
    }
}

function findThird(firstCard, secondCard) {
    let target = {};;

    if (firstCard.shape === secondCard.shape) {
        target.shape = firstCard.shape;
    } else {
        target.shape = 3 - firstCard.shape - secondCard.shape;
    }

    if (firstCard.color === secondCard.color) {
        target.color = firstCard.color;
    } else {
        target.color = 3 - firstCard.color - secondCard.color;
    }

    if (firstCard.qty === secondCard.qty) {
        target.qty = firstCard.qty;
    } else {
        target.qty = 3 - firstCard.qty - secondCard.qty;
    }

    if (firstCard.fill === secondCard.fill) {
        target.fill = firstCard.fill;
    } else {
        target.fill = 3 - firstCard.fill - secondCard.fill;
    }

    return target;
}

function findCardID(target) {
    let targetID;
    cards.forEach((card) => {
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
}

function displaySet(first, second, third) {
    $('.wrapper').addClass('set');
    $('.card#' + first).addClass('set');
    $('.card#' + second).addClass('set');
    $('.card#' + third).addClass('set');
}

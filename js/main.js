let cards = [];
let cardsLeft = [];
let currentCards = [];
let test = 0;
let speed = 1000;
let p = 0;
let solveTimeout;
let clockTimeout;
let waiting;
let foundSet;
let emptyPos = [];

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

$(document).on('keydown', (e) => {
    if (e.which === 32) {
        userSet();
    }
});

$(document).on('click', '.set-button', () => {
    userSet();
});

function start() {
    cardsLeft = cards.slice();
    for (let i = 0; i < 12; i += 1) {
        displayRandomCard();
    }

    setTimeout(() => {
        if (!waiting) {
            solve();
        }
    }, 2000);
}

function displayAllCards() {
    cards.forEach((card) => {
        displayCard(card);
    });
}

function displayRandomCard(pos) {
    let rand = Math.floor(Math.random()*cardsLeft.length);
    let card = cardsLeft[rand];

    if (pos === undefined) {
        pos = p;
        p += 1;
    }

    if (cardsLeft.indexOf(card) > -1) {
        cardsLeft.splice(cardsLeft.indexOf(card), 1);
        currentCards.push(card);
        displayCard(card, pos);
    }
}

function displayCard(card, pos) {
    let $div = $('<div>', {id: card.id, class: 'card c' + card.color + ' f' + card.fill});
    $div.attr('data-pos', pos);
    $div.css({
        top: pos%3 * 35 + '%',
        left: Math.floor(pos/3) * 15 + 25 + '%',
        transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)'
    });
    $div.on('click', () => {
        if (waiting) {
            clickCard($div);
        }
    });

    for (let qty = 0; qty <= card.qty; qty += 1) {
        if (card.shape === 0) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#tild"></use></svg>');
        } else if (card.shape === 1) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>');
        } else if (card.shape === 2) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#oval"></use></svg>');
        }
    }
    $('.wrapper').append($div);
}

function solve() {
    test += 1;
    console.log('test ' + test);
    if (test === 30) {
        for (let i = 0; i < 3; i += 1) {
            displayRandomCard();
        }
        test = 0;
    }

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
            $('.set-button').text('Too late!').addClass('disabled');
            displaySet(firstCard.id, secondCard.id, targetID);
            setTimeout(() => {
                removeCurrentByID(firstCard.id);
                setToBot(firstCard.id);
                setTimeout(() => {
                    removeCurrentByID(secondCard.id);
                    setToBot(secondCard.id);
                }, 200);
                setTimeout(() => {
                    removeCurrentByID(targetID);
                    setToBot(targetID);
                }, 400);
                setTimeout(() => {
                    for (let i = 0; i < 3; i += 1) {
                        displayRandomCard(emptyPos[0]);
                        emptyPos.shift();
                        test = 0;
                    }
                    console.log(currentCards);
                    foundSet = false;
                    solve();
                }, 1000);
            }, 2000);

        }
    });

    if (!foundSet) {
        solveTimeout = setTimeout(() => {
            solve(firstCard, secondCard);
        }, speed);
    }
}

function findThird(firstCard, secondCard) {
    let target = {};

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
    $('.card#' + first).addClass('set').css('transform', 'scale(1.15)');
    $('.card#' + second).addClass('set').css('transform', 'scale(1.15)');
    $('.card#' + third).addClass('set').css('transform', 'scale(1.15)');
}

function userSet() {
    if (foundSet) {
        return false;
    }
    const countdown = `<div class="countdown">
    <div class="countdown-number"></div>
    <svg>
    <circle r="14" cx="25" cy="15"></circle>
    </svg>
    </div>`;
    $('.bottom-row').prepend(countdown);
    clock(0);
    waiting = true;
    clearTimeout(solveTimeout);
    $('.set-button').text('Click three cards').addClass('disabled');
    $('.wrapper').addClass('waiting');
}


function clock(t) {
    if (t == 10) {
        $('.countdown').remove();
        $('.set-button').text('Too late!')
    } else {
        t += 1;
        $('.countdown-number').text(11 - t);
        console.log(11 - t + ' secs left');
        clockTimeout = setTimeout(() => {
            clock(t);
        }, 1000);
    }
}

function clickCard($div) {
    $div.toggleClass('selected');
    if ($('.card.selected').length === 3) {
        clearTimeout(clockTimeout);
        $('.countdown').remove();

        let selected = [];
        $('.card.selected').each((id, elem) => {
            selected.push($(elem).attr('id'));
        });
        let target = findThird(cards[selected[0]], cards[selected[1]]);
        findCardID(target);
        if (findCardID(target) === cards[selected[2]].id) {
            displaySet(cards[selected[0]].id, cards[selected[1]].id, cards[selected[2]].id);
            $('.set-button').text('Well done!');
        } else {
            $('.set-button').text('Sorry, no...');
        }
    }
}

function setToBot(id) {
    emptyPos.push(parseInt($('.card#' + id).attr('data-pos')));
    $('.wrapper').removeClass('set');
    $('.card#' + id).removeClass('set').attr('data-pos', 'bot').css({
        left: '5%',
        top: '35%',
        transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)',
        opacity: 1
    });
}

function removeCurrentByID(id) {
    currentCards.forEach((card) => {
        if (card.id === id) {
            console.log(card);
            currentCards.splice(currentCards.indexOf(card), 1);
        }
    });
    console.log(currentCards);
}

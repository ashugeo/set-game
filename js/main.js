// All 81 cards
let cards = [];

// Cards not distributed yet
let cardsLeft = [];

// Cards currently on the card
let currentCards = [];

// Number of bot test loops
let test = 0;

// Bot delay between each test
let speed = 1000;
let solveTimeout;

// Position of the cards on the table
let p = 0;
let emptyPos = [];

// Pausing the game to let user click cards
let clockTimeout;

// Game paused ?
let waiting = false;

// Set found ?
let foundSet = false;

// z-index of a card
let zIndex = 0;

$(document).ready(() => {
    generateCards();
    start();
});

$(document).on('click', '.set-button', () => {
    userSet();
});

$(document).on('keydown', (e) => {
    // User pressed space bar, same as clicking "Set" button
    if (e.which === 32) {
        userSet();
    }
});

// $(document).on('mouseover', '.card', (e) => {
//     // User cursos hovers a card
//     if (waiting) { // If waiting for him to select cards, highlight this card
//         $(e.currentTarget).css('transform', 'scale(1.1)');
//     }
// });
//
// $(document).on('mouseout', '.card', (e) => {
//     // User cursor leaves a card
//     if (waiting) {
//         // Remove highlight
//         $(e.currentTarget).css('transform', 'rotate(' + (Math.round(Math.random()* 6) - 3) + 'deg)');
//     }
// });

/**
* Generate all 81 cards
*/
function generateCards() {
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
}

/**
* Start the game
*/
function start() {
    // Copy all cards array to not-distributed-yet arrays
    cardsLeft = cards.slice();

    // Display first 12 cards
    for (let i = 0; i < 12; i += 1) {
        randomCard();
    }

    // Launch bot after 2 seconds
    setTimeout(() => {
        if (!waiting) {
            solve();
        }
    }, 2000);
}

/**
* Display all 81 cards (unused)
*/
function displayAllCards() {
    cards.forEach((card) => {
        displayCard(card);
    });
}

/**
* Generate a random card
* @param  {int} pos position of the card on the table
*/
function randomCard(pos) {
    // Select a card at random among those not delivered yet
    let rand = Math.floor(Math.random()*cardsLeft.length);
    let card = cardsLeft[rand];

    // Add this card from not-distributed-yet array and add it to currently-displayed array
    if (cardsLeft.indexOf(card) > -1) {
        cardsLeft.splice(cardsLeft.indexOf(card), 1);
        currentCards.push(card);
        displayCard(card, pos);
    }
}

/**
* Generate a card div and append it to .wrapper
* @param  {Object} card card parameters
* @param  {int}    pos  position of the card on the table
*/
function displayCard(card, pos) {
    // No pos parameter given, auto-increment
    if (pos === undefined) {
        pos = p;
        p += 1;
    }

    // Generate div with id, color and fill parameters
    let $div = $('<div>', {id: card.id, class: 'card c' + card.color + ' f' + card.fill});
    // Add position as data attribute
    $div.attr('data-pos', pos);
    // Set position and ad slight random rotation
    $div.css({
        top: pos%3 * 35 + '%',
        left: Math.floor(pos/3) * 15 + 25 + '%',
        transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)'
    });
    // Bind click event
    $div.on('click', () => {
        if (waiting) {
            clickCard($div);
        }
    });

    // Add symbol(s)
    for (let qty = 0; qty <= card.qty; qty += 1) {
        if (card.shape === 0) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#tild"></use></svg>');
        } else if (card.shape === 1) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#diamond"></use></svg>');
        } else if (card.shape === 2) {
            $div.append('<svg viewBox="0 0 12 8"><use xlink:href="#oval"></use></svg>');
        }
    }

    // Append div to .wrapper
    $('.wrapper').append($div);
}

function solve() {
    // Count tests loops
    test += 1;
    console.log('test ' + test);

    // After 30 unsuccessful loops, suggest user to add 3 cards
    if (test === 30) {
        showAddThree();
    }

    // Pick two cards at random
    let firstCard = currentCards[Math.floor(Math.random()*currentCards.length)];
    let secondCard = currentCards[Math.floor(Math.random()*currentCards.length)];

    // Make sure the same card has not been picked twice
    while (secondCard === firstCard) {
        secondCard = currentCards[Math.floor(Math.random()*currentCards.length)];
    }

    // Find corresponding third card
    let target = findThird(firstCard, secondCard);
    // Find corresponding third card ID
    let targetID = findCardID(target);

    // Check if third card is on the table
    currentCards.forEach((card) => {
        if (card.id === targetID) { // Bot found a set !
            // Stop bot tests
            foundSet = true;
            // Change "Set" button text
            $('.set-button').text('Too late!').addClass('disabled');
            // Show set
            displaySet(firstCard.id, secondCard.id, targetID);

            // Remove cards from currently-displayed array and move them away
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
                    // Add three new cards
                    for (let i = 0; i < 3; i += 1) {
                        randomCard(emptyPos[0]);
                        emptyPos.shift();
                        test = 0;
                    }
                    // User can play again
                    $('.set-button').text('Set !').removeClass('disabled');
                    // Launch bot tests again
                    foundSet = false;
                    solve();
                }, 1000);
            }, 2000);
        }
    });

    // This test didn't work, launch a new one
    if (!foundSet) {
        solveTimeout = setTimeout(() => {
            solve(firstCard, secondCard);
        }, speed);
    }
}

/**
* Find the corresponding third card for two given cards
* @param  {Object} firstCard  first card parameters
* @param  {Object} secondCard second card parameters
* @return {Object}            third card parameters (without ID)
*/
function findThird(firstCard, secondCard) {
    let target = {};

    // Test for shape
    if (firstCard.shape === secondCard.shape) {
        // First two cards have the same shape, the third one should as well
        target.shape = firstCard.shape;
    } else {
        // First two cards have different shapes, the third one should have the third shape
        target.shape = 3 - firstCard.shape - secondCard.shape;
    }

    // Test for color (same as above)
    if (firstCard.color === secondCard.color) {
        target.color = firstCard.color;
    } else {
        target.color = 3 - firstCard.color - secondCard.color;
    }

    // Test for symbols quantity (same as above)
    if (firstCard.qty === secondCard.qty) {
        target.qty = firstCard.qty;
    } else {
        target.qty = 3 - firstCard.qty - secondCard.qty;
    }

    // Test for fill pattern (same as above)
    if (firstCard.fill === secondCard.fill) {
        target.fill = firstCard.fill;
    } else {
        target.fill = 3 - firstCard.fill - secondCard.fill;
    }

    return target;
}

/**
* Find card ID depending on its parameters
* @param  {Object} target target card parameters
* @return {int}           ID of target card
*/
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

/**
* Show a valid set
* @param  {id} first  ID of first card
* @param  {id} second ID of second card
* @param  {id} third  ID of third card
*/
function displaySet(first, second, third) {
    $('.wrapper').addClass('set');
    $('.card#' + first).addClass('set').css('transform', 'scale(1.15)');
    $('.card#' + second).addClass('set').css('transform', 'scale(1.15)');
    $('.card#' + third).addClass('set').css('transform', 'scale(1.15)');
}

/**
* User has cliked "Set" button
*/
function userSet() {
    // Bot has found one before
    if (foundSet) {
        return false;
    }

    // Add 10 seconds countdown to .bottom-row
    const countdown = `<div class="countdown">
    <div class="countdown-number"></div>
    <svg>
    <circle r="14" cx="25" cy="15"></circle>
    </svg>
    </div>`;
    $('.bottom-row').prepend(countdown);

    // Waiting for user to pick three cards
    waiting = true;

    // Start a 10 seconds clock
    clock(0);

    // Stop bot tests
    clearTimeout(solveTimeout);

    // Change button text
    $('.set-button').text('Click three cards').addClass('disabled');

    // Make cards clickable
    $('.wrapper').addClass('waiting');
}

/**
* Give the user 10 seconds to select three cards
* @param  {int} t current clock state
*/
function clock(t) {
    if (t == 10) { // 10 seconds have passed
        $('.countdown').remove();
        $('.set-button').text('Too late!');

        setTimeout(() => {
            // User can play again
            $('.set-button').text('Set !').removeClass('disabled');

            // Launch bot tests again
            foundSet = false;
            solve();
        }, 2000);
    } else {
        // Increment seconds
        t += 1;
        // Display seconds remaining
        $('.countdown-number').text(11 - t);
        // Check again in a second
        clockTimeout = setTimeout(() => {
            clock(t);
        }, 1000);
    }
}

/**
* User clicks a card
* @param  {Object} $div jQuery object
*/
function clickCard($div) {
    // Toggle selected class to this card
    $div.toggleClass('selected');

    if ($('.card.selected').length === 3) { // 3 cards have been selected

        // Stop the clock, remove the countdown
        clearTimeout(clockTimeout);
        $('.countdown').remove();

        // Create array with the three selected cards
        let selected = [];
        $('.card.selected').each((id, elem) => {
            selected.push($(elem).attr('id'));
        });

        // Find the third card depending on the first two
        let target = findThird(cards[selected[0]], cards[selected[1]]);
        findCardID(target);

        // Check if it corresponds to the third selected card
        if (findCardID(target) === cards[selected[2]].id) { // User is right
            // Display valid set
            displaySet(cards[selected[0]].id, cards[selected[1]].id, cards[selected[2]].id);

            // Unselect
            $('.card.selected').removeClass('selected');

            // Remove cards from currently-displayed array and move them away
            setTimeout(() => {
                removeCurrentByID(cards[selected[0]].id);
                setToUser(cards[selected[0]].id);
                setTimeout(() => {
                    removeCurrentByID(cards[selected[1]].id);
                    setToUser(cards[selected[1]].id);
                }, 200);
                setTimeout(() => {
                    removeCurrentByID(cards[selected[2]].id);
                    setToUser(cards[selected[2]].id);
                }, 400);

                setTimeout(() => {
                    // Add three new cards
                    for (let i = 0; i < 3; i += 1) {
                        randomCard(emptyPos[0]);
                        emptyPos.shift();
                        test = 0;
                    }
                    // User can play again
                    $('.set-button').text('Set !').removeClass('disabled');
                    // Launch bot tests again
                    foundSet = false;
                    solve();
                }, 1000);
            }, 2000);

            // Change "Set" button text
            $('.set-button').text('Well done!');
        } else { // User is wrong
            // Change "Set" button text
            $('.set-button').text('Sorry, no...');

            setTimeout(() => {
                // Unselect
                $('.card.selected').removeClass('selected');

                // User can play again
                $('.set-button').text('Set !').removeClass('disabled');

                // Launch bot tests again
                foundSet = false;
                solve();
            }, 3000);
        }
    }
}

/**
* Give a card to the bot (from a valid set)
* @param {int} id card ID
*/
function setToBot(id) {
    emptyPos.push(parseInt($('.card#' + id).attr('data-pos')));
    $('.wrapper').removeClass('set');
    $('.card#' + id).removeClass('set').attr('data-pos', 'bot').css({
        left: '5%',
        top: '35%',
        transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)',
        opacity: 1,
        zIndex: zIndex
    });
    zIndex += 1;
}

/**
* Give a card to the user (from a valid set)
* @param {int} id card ID
*/
function setToUser(id) {
    emptyPos.push(parseInt($('.card#' + id).attr('data-pos')));
    $('.wrapper').removeClass('set');
    $('.card#' + id).removeClass('set').attr('data-pos', 'user').css({
        left: '85%',
        top: '35%',
        transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)',
        opacity: 1,
        zIndex: zIndex
    });
    zIndex += 1;
}

/**
* Remove a card from currently-displayed array
* @param  {int} id ID of the card to remove
*/
function removeCurrentByID(id) {
    currentCards.forEach((card) => {
        if (card.id === id) {
            currentCards.splice(currentCards.indexOf(card), 1);
        }
    });
}

/**
* Show button to add three cards
*/
function showAddThree() {
    // Generate button
    let $button = $('<div>', {class: 'add-three-button'});
    $button.text('Add three cards ?');

    // Bind click event
    $button.on('click', () => {
        $button.remove();
        for (let i = 0; i < 3; i += 1) {
            randomCard();
        }
        test = 0;
    });

    // Append button to .botton-row
    $('.bottom-row').append($button);
}

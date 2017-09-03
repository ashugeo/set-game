// All 81 cards
let cards = [];

// Cards not dealt yet
let stock = [];

// Cards currently on the card
let cardsShown = [];

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

// Points counter
let points = {
    'bot': 0,
    'user': 0
}

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
        // userSet();
        clearTimeout(solveTimeout);
    }
});

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
    // Copy all cards array to stock arrays
    stock = cards.slice();

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
    // Select a card at random among those not dealt yet
    let rand = Math.floor(Math.random()*stock.length);
    let card = stock[rand];

    // Remove this card from stock array and add it to currently-displayed array
    if (stock.indexOf(card) > -1) {
        stock.splice(stock.indexOf(card), 1);
        cardsShown.push(card);
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
    // Set position and add slight random rotation
    if (pos < 12) {
        $div.css({
            top: Math.floor(pos/4) * 220 + ($(window).outerHeight() - 800)/2 + 40,
            left: (pos%4) * 160 + ($(window).outerWidth() - 600)/2,
            transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)'
        });
    } else {
        $div.css({
            top: (pos%3) * 220 + ($(window).outerHeight() - 800)/2 + 40,
            left: Math.floor(pos/3) * 160 + ($(window).outerWidth() - 600)/2,
            transform: 'rotate(' + (Math.round(Math.random()*6) - 3) + 'deg)'
        });
    }
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
    if (test === 3) {
        showAddThree();
    }

    // Pick two cards at random
    let firstCard = cardsShown[Math.floor(Math.random()*cardsShown.length)];
    let secondCard = cardsShown[Math.floor(Math.random()*cardsShown.length)];

    // Make sure the same card has not been picked twice
    while (secondCard === firstCard) {
        secondCard = cardsShown[Math.floor(Math.random()*cardsShown.length)];
    }

    // Find corresponding third card
    let target = findThird(firstCard, secondCard);

    // Find corresponding third card ID
    let targetID = findCardID(target);

    // Check if third card is on the table
    cardsShown.forEach((card) => {
        if (card.id === targetID) { // Bot found a set!
            // Display valid set, move it away, increment points, add a new set
            validSet([firstCard.id, secondCard.id, targetID], 'bot');
            // Stop bot tests
            foundSet = true;
            // Change "Set" button text
            $('.set-button').text('Too late!').addClass('disabled');
        }
    });

    // This test didn't work, launch a new one
    if (!foundSet) {
        solveTimeout = setTimeout(() => {
            solve();
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
* Display valid set, then move it away and update points
* @param  {array}  set IDs of 3 cards
* @param  {string} to  'bot' or 'user'
*/
function validSet(set, to) {
    // Remove add-three-button
    $('.add-three-button').remove();
    // Display valid set
    showValidSet(set);

    setTimeout(() => {
        // Move set away
        moveSetAway(set, to);
        // Increment points
        updatePoints(1, to);

        setTimeout(() => {
            if (cardsShown.length === 9) {
                // Add a new set
                newSet();
            } else if (cardsShown.length > 9) {
                // Reorganize displayed cards
                reorganizeCards();
            }

            setTimeout(() => {
                // User can play again
                $('.set-button').text('Set !').removeClass('disabled');
                // Launch bot tests again
                foundSet = false;
                test = 0;
                solve();
            }, 1000);
        }, 1000);
    }, 2000);
}

/**
* Show a valid set
* @param  {array} set IDs of 3 cards
*/
function showValidSet(set) {
    $('.wrapper').addClass('set');
    for (let id of set) {
        $('.card#' + id).addClass('set').addClass('locked');
    }
}

function updatePoints(point, to) {
    if (point === 1) {
        // Add a point
        points[to] += 1;
    } else if (point === -1 && points[to] !== 0) {
        // Withdraw a point (if not already at 0)
        points[to] -= 1;

        // Take upper set away
        // moveSetAway([], 'none')
    }

    // Update text
    const $el = $('.' + to + ' p');
    $el.text(points[to] + ' set' + (points[to] > 1 ? 's' : ''));
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
    foundSet = true;

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
            selected.push(parseInt($(elem).attr('id')));
        });

        // Find the third card depending on the first two
        let target = findThird(cards[selected[0]], cards[selected[1]]);
        findCardID(target);

        // Check if it corresponds to the third selected card
        if (findCardID(target) === selected[2]) { // User found a set!
            // Display valid set, move it away, increment points, add a new set
            validSet([selected[0], selected[1], selected[2]], 'user');

            // Unselect
            $('.card.selected').removeClass('selected');

            // Change "Set" button text
            $('.set-button').text('Well done!');
        } else { // User is wrong
            // Change "Set" button text
            $('.set-button').text('Sorry, no...');

            // Withdraw one point
            updatePoints(-1, 'user');

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
* Move a valid set away (to either bot or user)
* @param  {array}  set IDs of 3 cards
* @param  {string} to  'bot' or 'user'
*/
function moveSetAway(set, to) {
    let delay = 0;
    for (let id of set) {
        setTimeout(() => {
            // Remove card from currently-displayed array
            removeCurrentByID(id);
            // Move card away
            moveCardAway(id, to);
        }, delay*200);
        delay += 1;
    }
}

/**
* Display three new cards and run bot test
*/
function newSet() {
    setTimeout(() => {
        // Add three new cards
        for (let i = 0; i < 3; i += 1) {
            // Set new card at first empty spot
            randomCard(emptyPos[0]);
            emptyPos.shift();
        }
    }, 1000);
}

/**
* Move a card away
* @param  {int}    id card ID
* @param  {string} to 'bot' or 'user'
*/
function moveCardAway(id, to) {
    $('.wrapper').removeClass('set');

    // Save emptied positions for new set to appear
    emptyPos.push(parseInt($('.card#' + id).attr('data-pos')));

    // Move cards
    $('.card#' + id).removeClass('set').attr('data-pos', to).css({
        left: $('.' + to + ' .sets-wrapper').offset().left,
        top: $('.' + to + ' .sets-wrapper').offset().top,
        transform: '',
        zIndex: zIndex
    });
    zIndex += 1;
}

/**
* Remove a card from currently-displayed array
* @param  {int} id ID of the card to remove
*/
function removeCurrentByID(id) {
    cardsShown.forEach((card) => {
        if (card.id === id) {
            cardsShown.splice(cardsShown.indexOf(card), 1);
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

/**
* Reorganize cards on the table
* @TODO: Works for 12 cards but not more
* @TODO: Second 'add-three-button' press will place new cards badly
* @TODO: Rework whole process
*/
function reorganizeCards() {
    // Build array of slots
    let slots = Array.from(new Array(12), (val, i) => i);

    // Build array of currently-displayed cards' positions
    let allPos = [];
    cardsShown.forEach((card) => {
        let pos = parseInt($('.card#' + card.id).attr('data-pos'));
        allPos.push(pos);
    });

    // Compute empty slots
    let emptySlots = slots.filter(x => allPos.indexOf(x) == -1);

    // Move right-most cards to empty spots on their left
    for (let slot of emptySlots) {
        // Basic movement is one slot to the left
        let shift = 1;

        for (let i = slot%4 + 1; i < 4; i++) { // From (empty spot + 1) to the end of the row

            // Card to move
            let card = slot - slot%4 + i;

            // If card isn't at this spot anymore, increment shift for next cards
            if (emptySlots.indexOf(card) !== -1) {
                shift += 1;
                continue;
            }

            // Card's new position
            const newPos = card - shift;

            // Update card's position
            updatePos(card, newPos);
        }
    }

    // Rebuild array of currently-displayed cards' positions
    allPos = [];
    cardsShown.forEach((card) => {
        let pos = parseInt($('.card#' + card.id).attr('data-pos'));
        allPos.push(pos);
    });

    // Compute empty slots again
    emptySlots = slots.filter(x => allPos.indexOf(x) == -1);

    // Move last column's cards to empty spots
    for (let card of allPos) {
        if (card > 11) {
            // Card's new position
            const newPos = emptySlots[0];

            // Update card's position
            updatePos(card, newPos);

            emptySlots.shift();
        }
    }
}

/**
* Update a card's position
* @param  {int} card   card's old position
* @param  {int} newPos target position
* @TODO: Refactor CSS positioning
*/
function updatePos(card, newPos) {
    // Get jQuery card object
    const $card = $('.card[data-pos="' + card + '"]');

    // Update data-pos attribute
    $card.attr('data-pos', newPos);

    // Update position
    if (newPos < 12) {
        $card.css({
            top: Math.floor(newPos/4) * 220 + ($(window).outerHeight() - 800)/2 + 40,
            left: (newPos%4) * 160 + ($(window).outerWidth() - 600)/2
        });
    } else {
        $card.css({
            top: (newPos%3) * 220 + ($(window).outerHeight() - 800)/2 + 40,
            left: Math.floor(newPos/3) * 160 + ($(window).outerWidth() - 600)/2
        });
    }
}

import { createCardElement, flipCard } from './card.js?v=3';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
const attemptsElement = document.getElementById('attempts');
const timerElement = document.getElementById('timer');
const resultElement = document.getElementById('result');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matchedPairs = 0;
let totalPairs = 0;

let timerInterval = null;
let secondsElapsed = 0;
let timerStarted = false;
let unflipTimeout = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        if (timerElement) {
            timerElement.textContent = secondsElapsed;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerStarted = false;
}

export function createBoard(cardCount) {
    if (unflipTimeout) {
        clearTimeout(unflipTimeout);
        unflipTimeout = null;
    }
    stopTimer();

    gameBoard.innerHTML = '';
    attempts = 0;
    matchedPairs = 0;
    totalPairs = cardCount / 2;
    secondsElapsed = 0;

    if (attemptsElement) {
        attemptsElement.textContent = attempts;
    }
    if (timerElement) {
        timerElement.textContent = secondsElapsed;
    }
    if (resultElement) {
        resultElement.style.display = 'none';
        resultElement.textContent = '';
    }

    resetBoard();

    const selectedCards = allCards.slice(0, totalPairs);
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => handleCardFlip(cardElement));
        gameBoard.appendChild(cardElement);
    });
}

function handleCardFlip(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

    startTimer();
    flipCard(cardElement);

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    lockBoard = true;
    attempts++;
    if (attemptsElement) {
        attemptsElement.textContent = attempts;
    }

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            endGame();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

function unflipCards() {
    unflipTimeout = setTimeout(() => {
        if (firstCard) {
            firstCard.classList.remove('flipped');
            firstCard.textContent = '';
        }
        if (secondCard) {
            secondCard.classList.remove('flipped');
            secondCard.textContent = '';
        }
        resetBoard();
        unflipTimeout = null;
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function endGame() {
    stopTimer();
    lockBoard = true;
    if (resultElement) {
        resultElement.textContent = `Peli ohi! Löysit kaikki parit. Yritykset: ${attempts}, Aika: ${secondsElapsed} sekuntia.`;
        resultElement.style.display = 'block';
    }
}

import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
const attemptsElement = document.getElementById('attempts');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function createBoard(cardCount) {
    gameBoard.innerHTML = '';
    attempts = 0;
    if (attemptsElement) {
        attemptsElement.textContent = attempts;
    }
    resetBoard();

    const selectedCards = allCards.slice(0, cardCount / 2);
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
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}
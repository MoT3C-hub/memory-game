export function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.card = card;
    return cardElement;
}

export function flipCard(cardElement) {
    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;
}
import { createBoard } from './board.js';

document.addEventListener('DOMContentLoaded', () => {
    const cardCountSelect = document.getElementById('card-count');
    const restartBtn = document.getElementById('restart-btn');

    function startGame() {
        const cardCount = parseInt(cardCountSelect.value, 10);
        createBoard(cardCount);
    }

    restartBtn.addEventListener('click', startGame);
    cardCountSelect.addEventListener('change', startGame);

    startGame();
});
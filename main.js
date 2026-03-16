const themes = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    toys: ['🧸', '🎨', '🧩', '🎸', '🎺', '🚗', '🚀', '⛵', '🚁', '🤖', '🎮', '🎳', '🎯', '🪁', '🛹'],
    space: ['🚀', '🛸', '👩‍🚀', '🪐', '🌟', '🌙', '☀️', '☄️', '🌌', '🌍', '🛰️', '🔭', '👽', '👾', '📡']
};

let currentTheme = 'animals';
let currentSize = 12;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isGameActive = false;

// DOM Elements
const setupMenu = document.getElementById('setup-menu');
const gameBoard = document.getElementById('game-board');

// Register Service Worker for PWA installation
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error', err));
    });
}

const winScreen = document.getElementById('win-screen');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const finalTimerDisplay = document.getElementById('final-timer');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// Initialize Menu
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentSize = parseInt(btn.dataset.size);
        startGame();
    });
});

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.theme-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentTheme = btn.dataset.theme;
    });
});

playAgainBtn.addEventListener('click', resetToMenu);

function startGame() {
    setupMenu.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    winScreen.classList.add('hidden');
    
    resetStats();
    generateCards();
    startTimer();
    isGameActive = true;
}

function resetStats() {
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';
    clearInterval(timer);
}

function generateCards() {
    gameBoard.innerHTML = '';
    const numPairs = currentSize / 2;
    const themeIcons = themes[currentTheme].slice(0, numPairs);
    const cardIcons = [...themeIcons, ...themeIcons];
    
    // Shuffle
    cardIcons.sort(() => Math.random() - 0.5);

    // Grid Layout
    let cols = currentSize === 12 ? 3 : 4;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    cardIcons.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-face card-back">?</div>
            <div class="card-face card-front">${icon}</div>
        `;

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (!isGameActive || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === currentSize / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function endGame() {
    isGameActive = false;
    clearInterval(timer);
    
    setTimeout(() => {
        finalTimerDisplay.textContent = timerDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        winScreen.classList.remove('hidden');
        triggerConfetti();
    }, 600);
}

function resetToMenu() {
    winScreen.classList.add('hidden');
    gameBoard.classList.add('hidden');
    setupMenu.classList.remove('hidden');
}

function triggerConfetti() {
    // Basic emoji confetti using current theme
    const emojis = themes[currentTheme];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        confetti.style.transition = `transform ${Math.random() * 3 + 2}s linear, top ${Math.random() * 3 + 2}s linear`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = '110vh';
            confetti.style.transform = `rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 200 - 100}px)`;
        }, 10);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

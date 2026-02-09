// Game Constants
const INITIAL_ARROWS = 15;
const INITIAL_TIME = 60;
const TARGET_INITIAL_SIZE = 120;
const TARGET_MIN_SIZE = 60;
const ARROW_SPEED = 12;
const DIFFICULTY_INTERVAL = 30; // every 30 points

// Game State
let score = 0;
let timeLeft = INITIAL_TIME;
let arrowsLeft = INITIAL_ARROWS;
let gameOver = false;
let gameStarted = false;
let hitFlash = false;

// Refs for mutable game values
let targetPos = 200;
let targetDir = 1;
let targetSpeed = 2;
let targetSize = TARGET_INITIAL_SIZE;
let arrowActive = false;
let arrowX = 160;
let arrowY = 300;

// DOM Elements
const gameArea = document.getElementById('gameArea');
const target = document.getElementById('target');
const arrow = document.getElementById('arrow');
const bow = document.getElementById('bow');
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('timeLeft');
const arrowsLeftElement = document.getElementById('arrowsLeft');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const hitFlashElement = document.getElementById('hitFlash');

// Game timers
let timerId = null;
let gameLoopId = null;

// ─── moveTarget() ───
function moveTarget() {
    const maxY = gameArea.clientHeight - targetSize - 80;
    const minY = 60;

    targetPos += targetSpeed * targetDir;
    if (targetPos >= maxY) {
        targetPos = maxY;
        targetDir = -1;
    }
    if (targetPos <= minY) {
        targetPos = minY;
        targetDir = 1;
    }

    if (target) {
        target.style.top = `${targetPos}px`;
        target.style.width = `${targetSize}px`;
        target.style.height = `${targetSize}px`;
    }
}

// ─── updateScore() ───
function updateScore() {
    score += 10;
    scoreElement.textContent = score;
    
    hitFlash = true;
    hitFlashElement.style.display = 'block';
    setTimeout(() => {
        hitFlash = false;
        hitFlashElement.style.display = 'none';
    }, 300);
}

// ─── increaseDifficulty() ───
function increaseDifficulty() {
    const level = Math.floor(score / DIFFICULTY_INTERVAL);
    targetSpeed = 2 + level * 0.8;
    targetSize = Math.max(TARGET_MIN_SIZE, TARGET_INITIAL_SIZE - level * 15);
}

// ─── shootArrow() ───
function shootArrow() {
    if (arrowActive || gameOver || arrowsLeft <= 0) return;

    arrowActive = true;
    arrowsLeft -= 1;
    arrowsLeftElement.textContent = arrowsLeft;
    
    // Update arrows color based on count
    if (arrowsLeft <= 3) {
        arrowsLeftElement.classList.add('low');
    } else {
        arrowsLeftElement.classList.remove('low');
    }

    // Position arrow at the bow
    const bowRect = bow.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();
    arrowX = bowRect.right - areaRect.left;
    arrowY = bowRect.top - areaRect.top + bowRect.height / 2 - 3;

    if (arrow) {
        arrow.style.display = "block";
        arrow.style.left = `${arrowX}px`;
        arrow.style.top = `${arrowY}px`;
    }
}

// ─── startTimer() ───
function startTimer() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
        timeLeft -= 1;
        timeLeftElement.textContent = `${timeLeft}s`;
        
        // Update time color based on remaining time
        if (timeLeft <= 10) {
            timeLeftElement.classList.add('low');
        } else {
            timeLeftElement.classList.remove('low');
        }
        
        if (timeLeft <= 0) {
            gameOver = true;
            endGame();
            if (timerId) clearInterval(timerId);
        }
    }, 1000);
}

// ─── Collision detection ───
function checkCollision() {
    const aRect = arrow.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    const arrowTip = aRect.right;
    const arrowMid = aRect.top + aRect.height / 2;

    return (
        arrowTip >= tRect.left &&
        arrowTip <= tRect.right &&
        arrowMid >= tRect.top &&
        arrowMid <= tRect.bottom
    );
}

// ─── Game loop ───
function gameLoop() {
    if (gameOver) return;

    moveTarget();

    // Move arrow
    if (arrowActive && arrow && gameArea) {
        arrowX += ARROW_SPEED;
        arrow.style.left = `${arrowX}px`;

        // Check collision
        if (checkCollision()) {
            arrowActive = false;
            arrow.style.display = "none";
            updateScore();
            increaseDifficulty();
        }
        // Arrow out of bounds
        else if (arrowX > gameArea.clientWidth) {
            arrowActive = false;
            arrow.style.display = "none";

            // Check game over (no arrows left)
            if (arrowsLeft <= 0) {
                gameOver = true;
                endGame();
                if (timerId) clearInterval(timerId);
            }
        }
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

// ─── End game ───
function endGame() {
    gameOverScreen.style.display = 'flex';
    finalScoreElement.textContent = score;
}

// ─── Start game ───
function startGame() {
    score = 0;
    arrowsLeft = INITIAL_ARROWS;
    timeLeft = INITIAL_TIME;
    gameOver = false;
    arrowActive = false;
    targetPos = 200;
    targetDir = 1;
    targetSpeed = 2;
    targetSize = TARGET_INITIAL_SIZE;

    scoreElement.textContent = score;
    arrowsLeftElement.textContent = arrowsLeft;
    timeLeftElement.textContent = `${timeLeft}s`;
    
    // Reset styles
    arrowsLeftElement.classList.remove('low');
    timeLeftElement.classList.remove('low');
    hitFlashElement.style.display = 'none';

    // Hide screens
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    gameStarted = true;

    if (arrow) arrow.style.display = 'none';

    // Reset target position
    target.style.top = `${targetPos}px`;
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;

    startTimer();

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
}

// ─── Event Listeners ───
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
            startGame();
        } else {
            shootArrow();
        }
    }
});

gameArea.addEventListener('click', () => {
    if (!gameStarted) {
        startGame();
    } else {
        shootArrow();
    }
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
});

// Initialize game
window.addEventListener('load', () => {
    startScreen.style.display = 'flex';
});
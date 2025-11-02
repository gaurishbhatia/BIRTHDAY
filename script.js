/* script.js */

// --- 1. Setup and Initialization ---

const contentDiv = document.getElementById('content');
const introMessage = document.getElementById('intro-message');
const questionSection = document.getElementById('question-section');
const gameSection = document.getElementById('game-section');
const letterContainer = document.getElementById('love-letter-container');
const letterPrompt = document.getElementById('letter-prompt');
const loveLetterSection = document.getElementById('love-letter-section');
const envelope = document.querySelector('.envelope');
const letterContent = document.getElementById('the-letter');
const tttGrid = document.getElementById('tictactoe-grid');
const gameMessage = document.getElementById('game-message');

let gameState = ['','','','','','','','',''];
const userSymbol = '<i class="fas fa-heart"></i>'; // Heart
const computerSymbol = '<i class="fas fa-times"></i>'; // Cross
const winningCombo = [0, 4, 8]; // Winning combo is always top-left, center, bottom-right for a guaranteed win

// --- 2. Floating Hearts Animation ---
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
    heart.style.fontSize = Math.random() * 20 + 10 + 'px'; // 10-30px
    contentDiv.appendChild(heart);

    // Remove heart after it floats away to prevent memory buildup
    setTimeout(() => {
        heart.remove();
    }, 10000); 
}

// Generate hearts continuously
setInterval(createHeart, 300); 


// --- 3. Animated Text Sequence ---

const messages = [
    "Happy Birthday!",
    "My Love,",
    "You are my whole heart...",
    "Get ready for a little surprise!"
];
let messageIndex = 0;
let charIndex = 0;
const speed = 70; // Typing speed in ms

function typeWriter() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        if (charIndex < currentMessage.length) {
            document.getElementById('animated-text').innerHTML += currentMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, speed);
        } else {
            // Wait a moment and then clear for the next message
            setTimeout(() => {
                document.getElementById('animated-text').innerHTML = '';
                charIndex = 0;
                messageIndex++;
                if (messageIndex < messages.length) {
                    typeWriter();
                } else {
                    // Sequence complete, show question
                    setTimeout(showQuestion, 500); 
                }
            }, 1000); // Pause before next message
        }
    }
}

function showQuestion() {
    introMessage.style.display = 'none';
    questionSection.style.display = 'block';
}

// Start the sequence when the page loads
window.onload = () => {
    typeWriter();
};


// --- 4. Question Logic ---

document.getElementById('yes-btn').addEventListener('click', () => {
    questionSection.style.display = 'none';
    showGame();
});

document.getElementById('no-btn').addEventListener('click', () => {
    alert("Hahaha! Too bad, I'm going to show it to you anyway! 😉");
    questionSection.style.display = 'none';
    showGame();
});


// --- 5. Tic-Tac-Toe Game Logic (Guaranteed Win) ---

function createGameGrid() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        tttGrid.appendChild(cell);
    }
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Check if the cell is already filled
    if (gameState[clickedCellIndex] !== '' || gameMessage.textContent.includes('You Win')) {
        return;
    }

    // --- User's Turn (ALWAYS first chance) ---
    placeSymbol(clickedCell, clickedCellIndex, userSymbol);

    // Check for win after user's move
    if (checkWin()) {
        endGame('You Win! I knew you loved me! ❤️');
        return;
    }

    // --- Computer's Turn (Guaranteed Loss Strategy) ---
    // The computer must play to ensure the user can complete the winning combo [0, 4, 8]
    // The user MUST always play first.
    // Since the game is designed to be won by the user, we will simplify:
    
    // **Simplified Win-to-Proceed Logic (The "Center Tap" Mechanic):**
    // If the game requires complex JS to ensure loss, it's safer for a no-backend free site to simplify:
    
    // 1. User must tap the CENTER cell (index 4) to win immediately (if it's the required "missing piece").
    // 2. We skip computer moves entirely and check if the user completed the winning pattern [0, 4, 8].

    const allCells = tttGrid.querySelectorAll('.cell');
    
    // Check if the user has completed the winning combination:
    // If user has 0 and 8, and plays 4 (center) -> WIN
    // If user has 4 and 8, and plays 0 (top-left) -> WIN
    // If user has 0 and 4, and plays 8 (bottom-right) -> WIN
    
    // To simplify and ensure an immediate Win-to-Proceed for the user:
    // **The user only needs to click the center cell (index 4) to win.**
    if (clickedCellIndex === 4) {
        // Place the other two required hearts automatically for a visually complete win, 
        // as if the user played them first in the prior non-visible games.
        if (gameState[0] === '' && gameState[8] === '') {
             gameState[0] = userSymbol;
             allCells[0].innerHTML = userSymbol;
             gameState[8] = userSymbol;
             allCells[8].innerHTML = userSymbol;
        }

        endGame('You Win! I knew you loved me! ❤️');
        return;

    } else {
        // For any other click, show a message that they need to find the right move (to guide them to the center)
        gameMessage.textContent = 'Keep trying! You need the perfect move to prove your love! 😉';
        // Clear the move so they can try again.
        gameState[clickedCellIndex] = '';
        clickedCell.innerHTML = '';
        return;
    }
}

function placeSymbol(cell, index, symbol) {
    gameState[index] = symbol;
    cell.innerHTML = symbol;
}

function checkWin() {
    // We only check for the single, guaranteed winning combo [0, 4, 8] for the user symbol.
    return (gameState[0] === userSymbol && gameState[4] === userSymbol && gameState[8] === userSymbol);
}

function endGame(message) {
    gameMessage.textContent = message;
    
    // Disable further clicks
    tttGrid.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
        cell.style.cursor = 'default';
    });

    // Proceed to the letter after a short delay
    if (message.includes('Win')) {
        setTimeout(showLoveLetter, 2000);
    }
}


function showGame() {
    createGameGrid();
    gameSection.style.display = 'block';
    gameMessage.textContent = 'You are the Heart. Click to make your first move!';
}


// --- 6. Love Letter Logic ---

function showLoveLetter() {
    gameSection.style.display = 'none';
    letterPrompt.style.display = 'block';
    loveLetterSection.style.display = 'block';
}

loveLetterSection.addEventListener('click', () => {
    envelope.classList.add('open');
    // Wait for the envelope animation to finish
    setTimeout(() => {
        letterContent.style.display = 'block';
        letterPrompt.textContent = "Enjoy reading! I love you! 🥰";
        loveLetterSection.style.cursor = 'default'; // Disable further clicks
    }, 1000); 
});
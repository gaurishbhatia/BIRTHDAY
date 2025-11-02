/* script.js (UPDATED) */

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
// The user needs to play the center (index 4) to win.

// --- 2. Floating Hearts Animation (Slightly adjusted timing for smoother visual) ---
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    // Randomize symbol size and type slightly for more visual interest
    heart.innerHTML = Math.random() < 0.8 ? '<i class="fas fa-heart"></i>' : '<i class="fas fa-star"></i>'; 
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 8 + 10 + 's'; // 10-18s
    heart.style.animationDelay = Math.random() * -10 + 's'; // Start some off-screen
    heart.style.fontSize = Math.random() * 20 + 15 + 'px'; 
    contentDiv.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 18000); 
}
setInterval(createHeart, 200); 

// --- Helper for smooth section transitions ---
function switchSection(hideElement, showElement) {
    // 1. Start fade-out and scale down
    if (hideElement) {
        hideElement.classList.remove('active');
    }
    
    // 2. Wait for transition to finish, then set display:none
    setTimeout(() => {
        if (hideElement) {
             hideElement.style.display = 'none';
        }
        
        // 3. Set new element display:block, and then start fade-in/scale up
        showElement.style.display = 'block';
        setTimeout(() => {
            showElement.classList.add('active');
        }, 50); // Small delay to trigger CSS transition
        
    }, 500); // Matches the CSS transition time
}


// --- 3. Animated Text Sequence ---

const messages = [
    "Happy Birthday!",
    "My Love,",
    "You are my whole heart...",
    "Get ready for a little surprise!"
];
let messageIndex = 0;
let charIndex = 0;
const speed = 70; 

function typeWriter() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        if (charIndex < currentMessage.length) {
            document.getElementById('animated-text').innerHTML += currentMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, speed);
        } else {
            setTimeout(() => {
                document.getElementById('animated-text').innerHTML = '';
                charIndex = 0;
                messageIndex++;
                if (messageIndex < messages.length) {
                    typeWriter();
                } else {
                    setTimeout(() => switchSection(introMessage, questionSection), 500); 
                }
            }, 1200); // Pause before next message
        }
    }
}

window.onload = () => {
    typeWriter();
};


// --- 4. Question Logic ---

document.getElementById('yes-btn').addEventListener('click', () => {
    switchSection(questionSection, gameSection);
    showGame();
});

document.getElementById('no-btn').addEventListener('click', () => {
    gameMessage.textContent = "Hahaha! Too bad, I'm going to show it to you anyway! 😉";
    setTimeout(() => {
         switchSection(questionSection, gameSection);
         showGame();
    }, 1500);
});


// --- 5. Tic-Tac-Toe Game Logic (Guaranteed Win via Center) ---

function createGameGrid() {
    tttGrid.innerHTML = ''; // Clear existing
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

    if (gameState[clickedCellIndex] !== '' || gameMessage.textContent.includes('Win')) {
        return;
    }
    
    // **The Guaranteed Win Logic: Must click the Center (index 4)**
    if (clickedCellIndex === 4) {
        // 1. Place the Heart in the center
        placeSymbol(clickedCell, clickedCellIndex, userSymbol); 
        
        // 2. Auto-fill the two required hearts (0 and 8) to complete the visual win
        const allCells = tttGrid.querySelectorAll('.cell');
        setTimeout(() => { // Small delay for visual effect
             if (gameState[0] === '') {
                gameState[0] = userSymbol;
                allCells[0].innerHTML = userSymbol;
             }
             if (gameState[8] === '') {
                 gameState[8] = userSymbol;
                 allCells[8].innerHTML = userSymbol;
             }
             endGame('You Win! I knew you loved me! ❤️', true);
        }, 500);
        
    } else {
        // User clicked the wrong spot: Playful response, clear move, and hint
        gameMessage.innerHTML = 'Hmm, not quite! You need to find the **heart** of the matter... 😉';
        
        // Temporarily place the symbol and then clear it
        placeSymbol(clickedCell, clickedCellIndex, userSymbol);
        setTimeout(() => {
            gameState[clickedCellIndex] = '';
            clickedCell.innerHTML = '';
            gameMessage.innerHTML = 'Win to prove that you love me!'; // Reset message
        }, 1000); // Clear after 1 second
    }
}

function placeSymbol(cell, index, symbol) {
    gameState[index] = symbol;
    cell.innerHTML = symbol;
}

function endGame(message, didWin) {
    gameMessage.textContent = message;
    
    tttGrid.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
        cell.style.cursor = 'default';
    });

    if (didWin) {
        setTimeout(showLoveLetter, 2000);
    }
}

function showGame() {
    createGameGrid();
    gameMessage.textContent = 'You are the Heart. Click to make your first move!';
}


// --- 6. Love Letter Logic ---

function showLoveLetter() {
    switchSection(gameSection, letterContainer);
    letterPrompt.style.display = 'block';
    loveLetterSection.style.display = 'block';
}

loveLetterSection.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    
    envelope.classList.add('open');
    letterPrompt.textContent = "Enjoy reading! I love you! 🥰";
    
    setTimeout(() => {
        // 3D flip effect: show content after the envelope has flipped
        letterContent.style.display = 'block';
        letterContent.style.opacity = '0';
        setTimeout(() => {
             letterContent.style.transition = 'opacity 1s';
             letterContent.style.opacity = '1';
        }, 100);
    }, 500); // Halfway through the 1s envelope flip animation
});
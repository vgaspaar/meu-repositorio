const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restart");
const startBtn = document.getElementById("start");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameRunning = false;

let speed = 5;
let lastIncrease = 0;

let scoreInterval = null;
let collisionInterval = null;
let gameLoop = null;

// posição do obstáculo
let obstaclePosition = window.innerWidth;

highScoreText.innerText = "Recorde: " + highScore;

// PULO
document.onkeydown = () => {
    if (!player.classList.contains("jump") && gameRunning) {
        player.classList.add("jump");

        if (jumpSound) jumpSound.currentTime = 0, jumpSound.play();

        setTimeout(() => {
            player.classList.remove("jump");
        }, 500);
    }
};

// START
startBtn.onclick = () => {
    startBtn.style.display = "none";
    startGame();
};

// INICIAR JOGO
function startGame() {
    clearInterval(scoreInterval);
    clearInterval(collisionInterval);
    cancelAnimationFrame(gameLoop);

    score = 0;
    speed = 10;
    lastIncrease = 0;
    gameRunning = true;

    scoreText.innerText = "Score: 0";
    gameOverText.style.display = "none";
    restartBtn.style.display = "none";

    obstaclePosition = window.innerWidth;

    moveObstacle();
    updateScore();
    checkCollision();
}

// MOVIMENTO SUAVE DO OBSTÁCULO
function moveObstacle() {
    if (!gameRunning) return;

    obstaclePosition -= speed;
    obstacle.style.left = obstaclePosition + "px";

    // reaparece do lado direito
    if (obstaclePosition < -60) {
        obstaclePosition = window.innerWidth;
    }

    gameLoop = requestAnimationFrame(moveObstacle);
}

// SCORE + DIFICULDADE
function updateScore() {
    scoreInterval = setInterval(() => {
        if (gameRunning) {
            score++;
            scoreText.innerText = "Score: " + score;

            // aumenta dificuldade sem bug
            if (score - lastIncrease >= 50) {
                lastIncrease = score;
                speed += 1;
            }
        }
    }, 100);
}

// COLISÃO
function checkCollision() {
    collisionInterval = setInterval(() => {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver();
        }
    }, 10);
}

// GAME OVER
function gameOver() {
    gameRunning = false;

    gameOverText.style.display = "block";
    restartBtn.style.display = "block";

    if (gameOverSound) gameOverSound.play();

    // salvar recorde
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreText.innerText = "Recorde: " + highScore;
    }

    cancelAnimationFrame(gameLoop);
    clearInterval(scoreInterval);
    clearInterval(collisionInterval);
}

// REINICIAR
restartBtn.onclick = () => {
    startGame();
};
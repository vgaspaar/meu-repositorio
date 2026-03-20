const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameOverText = document.getElementById("gameOver");
const restartBtn = document.getElementById("restart");
const scoreText = document.getElementById("score");

let score = 0;
let gameRunning = false;

let scoreInterval = null;
let collisionInterval = null;

// REMOVE evento antigo (evita duplicação)
document.onkeydown = null;

// PULO (garante 1 só evento)
document.onkeydown = () => {
    if (!player.classList.contains("jump") && gameRunning) {
        player.classList.add("jump");

        setTimeout(() => {
            player.classList.remove("jump");
        }, 500);
    }
};

// INICIAR JOGO
function startGame() {
    // Mata tudo antes
    clearInterval(scoreInterval);
    clearInterval(collisionInterval);

    score = 0;
    gameRunning = true;

    scoreText.innerText = "Score: 0";
    gameOverText.style.display = "none";
    restartBtn.style.display = "none";

    obstacle.style.animation = "none";
    void obstacle.offsetWidth; // força reset da animação
    obstacle.style.animation = "moveObstacle 2s linear infinite";

    // SCORE
    scoreInterval = setInterval(() => {
        if (gameRunning) {
            score++;
            scoreText.innerText = "Score: " + score;
        }
    }, 100);

    // COLISÃO
    collisionInterval = setInterval(() => {
        let playerBottom = parseInt(window.getComputedStyle(player).bottom);
        let obstacleRight = parseInt(window.getComputedStyle(obstacle).right);

        if (
            obstacleRight > window.innerWidth - 100 &&
            obstacleRight < window.innerWidth - 40 &&
            playerBottom < 50
        ) {
            gameOver();
        }
    }, 10);
}

// GAME OVER
function gameOver() {
    gameRunning = false;

    obstacle.style.animation = "none";
    gameOverText.style.display = "block";
    restartBtn.style.display = "block";

    clearInterval(scoreInterval);
    clearInterval(collisionInterval);
}

// REINICIAR
restartBtn.onclick = () => {
    startGame();
};

// INICIA UMA ÚNICA VEZ
startGame();
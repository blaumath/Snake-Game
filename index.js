const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const pauseBtn = document.querySelector(".pause-btn"); // Seleciona o botão de pausa

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let paused = false; // Adicionado variável para controlar se o jogo está pausado ou não

// Obtém a pontuação máxima do armazenamento local

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Passa um número aleatório entre 1 e 30 como posição da comida

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Fim de jogo! Aperte OK para recomeçar...");
    location.reload();
}

// Altera o valor da velocidade com base na tecla pressionada

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Altera a direção em cada clique de tecla

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Adicionado evento de clique ao botão de pausa
pauseBtn.addEventListener("click", () => {
    paused = !paused; // Alterna o valor da variável paused
    pauseBtn.innerText = paused ? "Continuar" : "Pausar"; // Altera o texto do botão de acordo com o estado do jogo
});

const initGame = () => {
    if (gameOver) return handleGameOver();
    if (paused) return; // Se o jogo estiver pausado, não executa o restante do código
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Quando a cobra come a comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Adiciona a comida ao array do corpo da cobra
        score++;
        highScore = score >= highScore ? score : highScore; // se a pontuação > pontuação máxima => pontuação máxima = pontuação

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Atualiza a cabeça da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    // Permitir que a cobra atravesse as paredes
    if (snakeX <= 0) {
        snakeX = 30;
    } else if (snakeX > 30) {
        snakeX = 1;
    }
    
    if (snakeY <= 0) {
        snakeY = 30;
    } else if (snakeY > 30) {
        snakeY = 1;
    }

    // Deslocando os valores dos elementos do corpo da cobra para frente por um

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Adiciona uma div para cada parte do corpo da cobra

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verifica se a cabeça da cobra atingiu o corpo ou não
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);

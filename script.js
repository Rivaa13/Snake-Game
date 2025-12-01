const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let velocityX = 1;
let velocityY = 0;
let snake = [];
let snakeLength = 5;
let foodX = 15;
let foodY = 15;

// Start in the middle
let headX = 10;
let headY = 10;

// Game loop
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    setTimeout(drawGame, 1000 / 10); // 10 FPS
}

function isGameOver() {
    let gameOver = false;

    // Check walls
    if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        gameOver = true;
    }

    // Check self collision
    // Skip the head (last element)
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    return gameOver;
}

function drawScore() {
    scoreElement.innerText = score;
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Add new head
    snake.push({ x: headX, y: headY });

    // Remove tail if snake is too long
    while (snake.length > snakeLength) {
        snake.shift();
    }
}

function changeSnakePosition() {
    headX = headX + velocityX;
    headY = headY + velocityY;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

function checkAppleCollision() {
    if (foodX === headX && foodY === headY) {
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
        snakeLength++;
        score++;
    }
}

document.body.addEventListener('keydown', keyDown);

// Touch controls
document.getElementById('btnUp').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('btnDown').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('btnLeft').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('btnRight').addEventListener('click', () => changeDirection(1, 0));

function changeDirection(x, y) {
    // Prevent reversing direction
    if (velocityX !== 0 && x !== 0) return;
    if (velocityY !== 0 && y !== 0) return;

    velocityX = x;
    velocityY = y;
}

function keyDown(event) {
    // Up
    if (event.keyCode == 38) {
        changeDirection(0, -1);
    }
    // Down
    if (event.keyCode == 40) {
        changeDirection(0, 1);
    }
    // Left
    if (event.keyCode == 37) {
        changeDirection(-1, 0);
    }
    // Right
    if (event.keyCode == 39) {
        changeDirection(1, 0);
    }
}

drawGame();

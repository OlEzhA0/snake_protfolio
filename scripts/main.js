'use strict';

const field = document.querySelector('.field');
const wrap = document.querySelector('.wrapper');
const scoreText = document.querySelector('.score');
const reset = document.querySelector('.game-over__button');
const gameOver = document.querySelector('.game-over');
const finalScore = document.querySelector('.game-over__score');
const howLose = document.querySelector('.game-over__score-how-lose');
const ctx = field.getContext('2d');
const fieldWidth = 30;
const fieldHeight = 20;
const fieldCell = 32;
const food = new Image();
const wrapper = throttle(direction, 200);
let even = 0;
let score = 0;

food.src = 'images/food.png';

let foodCoords = {
  x: Math.floor((Math.random() * fieldWidth)) * fieldCell,
  y: Math.floor((Math.random() * fieldHeight)) * fieldCell,
};

const snake = [{
  x: (fieldWidth / 2) * fieldCell,
  y: (fieldHeight / 2) * fieldCell,
}];

drawField();

reset.addEventListener('click', () => {
  snake.length = 0;

  snake[0] = {
    x: (fieldWidth / 2) * fieldCell,
    y: (fieldHeight / 2) * fieldCell,
  };

  foodCoords = {
    x: Math.floor((Math.random() * fieldWidth)) * fieldCell,
    y: Math.floor((Math.random() * fieldHeight)) * fieldCell,
  };
  pastKey = '';
  score = 0;
  game = setInterval(drawGame, 150);
  ctx.clearRect(0, 0, field.width, field.height);
  scoreText.style.display = 'block';
  gameOver.style.display = 'none';
});

function drawGame() {
  ctx.clearRect(0, 0, field.width, field.height);
  scoreText.textContent = `score: ${score}`;
  ctx.drawImage(food, foodCoords.x, foodCoords.y);

  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = '#00612b';
    } else {
      ctx.fillStyle = 'green';
    }
    ctx.fillRect(snake[i].x, snake[i].y, fieldCell, fieldCell);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX === foodCoords.x && snakeY === foodCoords.y) {
    score++;

    foodCoords = {
      x: Math.floor((Math.random() * fieldWidth)) * fieldCell,
      y: Math.floor((Math.random() * fieldHeight)) * fieldCell,
    };
    drawFood();
  } else {
    snake.pop();
  }

  if (snakeX < 0
    || snakeX > fieldCell * (fieldWidth - 1)
    || snakeY < 0
    || snakeY > fieldCell * (fieldHeight - 1)) {
    clearInterval(game);
    howLose.textContent = `Вы врезались в стену!`;
    scoreText.style.display = 'none';
    finalScore.textContent = `Ваш счет: ${score}`;
    gameOver.style.display = 'block';
  }

  if (pastKey === 'left') {
    snakeX -= fieldCell;
  }

  if (pastKey === 'right') {
    snakeX += fieldCell;
  }

  if (pastKey === 'up') {
    snakeY -= fieldCell;
  }

  if (pastKey === 'down') {
    snakeY += fieldCell;
  }

  const snakeHead = {
    x: snakeX,
    y: snakeY,
  };

  snake.unshift(snakeHead);

  eatTail(snakeHead, snake);
}

let game = setInterval(drawGame, 150);

document.addEventListener('keydown', wrapper);

let pastKey;

function drawFood() {
  for (const key of snake) {
    if (key.x === foodCoords.x
      && key.y === foodCoords.y) {
      foodCoords = {
        x: Math.floor((Math.random() * fieldWidth)) * fieldCell,
        y: Math.floor((Math.random() * fieldHeight)) * fieldCell,
      };
    }
  }

  return;
}

function eatTail(head, body) {
  for (let i = 1; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      clearInterval(game);
      scoreText.style.display = 'none';
      howLose.textContent = `Вы съели хвост!`;
      finalScore.textContent = `Ваш счет: ${score}`;
      gameOver.style.display = 'block';
    }
  }
}

function direction(event) {
  console.log(even.keyCode)
  if ((event.keyCode === 37
    || event.keyCode === 65)
    && pastKey !== 'right'
    ) {
    pastKey = 'left';
  } else if ((event.keyCode === 38
    || event.keyCode === 87)
    && pastKey !== 'down'
    ) {
    pastKey = 'up';
  } else if ((event.keyCode === 39
    || event.keyCode === 68)
    && pastKey !== 'left'
    ) {
    pastKey = 'right';
  } else if ((event.keyCode === 40
    || event.keyCode === 83)
    && pastKey !== 'up'
    ) {
    pastKey = 'down';
  }
}

function drawField() {
  for (let i = 0; i < fieldHeight; i++) {
    for (let j = 0; j < fieldWidth; j++) {
      const cell = document.createElement('div');

      if (even % 2 === 0) {
        cell.classList.add('cell', 'even');
      } else {
        cell.classList.add('cell', 'odd');
      }
      even++;
      wrap.append(cell);
    }
    even++;
  }
};

function throttle(f, delay) {
  let wait = false;
  let savedArgs = null;

  return (...args) => {
    if (wait) {
      savedArgs = args;

      return;
    }

    wait = true;
    savedArgs = null;

    f(...args);

    setTimeout(() => {
      wait = false;

      if (savedArgs) {
        wrapper(...savedArgs)
      }
    }, delay);
  };
}

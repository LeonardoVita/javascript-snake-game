const canvas = document.getElementById("Snake");
const context = canvas.getContext("2d");
const box = 32;
const snake = [];

snake[0] = {
  x: 8 * box,
  y: 8 * box,
}

let direction = "right"

function createBackground(){
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake(){
  for(i=0; i < snake.length; i++){
    context.fillStyle = "green";
    context.fillRect(snake[i].x, snake[i].y, box, box)
  }
}

function playGame(){
  createBackground();
  createSnake();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  switch (direction) {
    case "right":
      snakeX += box;
      break;
    case "left":
      snakeX -= box;
      break;
    case "up":
      snakeY -= box;
      break;
    case "down":
      snakeX += box;
      break; 
    default:
      break;
  }
  
  snake.pop();

  let newHead = {
    x: snakeX,
    y: snakeY,
  }
  snake.unshift(newHead);
}

const jogo = setInterval(playGame, 100);

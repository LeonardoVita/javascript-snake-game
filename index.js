const sprites = new Image();
sprites.src = "./snake-graphics.png";

const canvas = document.getElementById("Snake");
const context = canvas.getContext("2d");
const box = 32;
const snake = [];

snake[0] = {
  x: 8 * box,
  y: 8 * box,
}
snake[1] = {}


const food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box,  
}

let direction = "right"

function createBackground(){
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake(){

  let spriteHead= {
    x: 256,
    y: 0,
  };

  switch (direction) {
    case "right":
      spriteHead.x = 256; 
      spriteHead.y = 0;
      break;
    case "left":
      spriteHead.x = 192; 
      spriteHead.y = 64;      
      break;
    case "up":
      spriteHead.x = 192; 
      spriteHead.y = 0;
      break;
    case "down":
      spriteHead.x = 256; 
      spriteHead.y = 64;
      break; 
    default:
      break;
  }

  //SNAKE HEAD
  context.drawImage(
    sprites,
    spriteHead.x, spriteHead.y,
    64, 64,
    snake[0].x, snake[0].y,
    box,box
  );

  //SNAKE BODDY
  for(i=1; i < snake.length-1; i++){
    const spriteBody= {
      x: 0,
      y: 0
    }

    if(snake[i-1].x < snake[i].x && snake[i+1].x > snake[i].x || 
      snake[i-1].x > snake[i].x && snake[i+1].x < snake[i].x){
      spriteBody.x = 64;
      spriteBody.y = 0;
    }

    if(snake[i-1].y < snake[i].y && snake[i+1].y > snake[i].y || 
      snake[i-1].y > snake[i].y && snake[i+1].y < snake[i].y){
      spriteBody.x = 128;
      spriteBody.y = 64;
    }


    if(snake[i-1].x > snake[i].x && snake[i+1].y > snake[i].y ||
      snake[i+1].x > snake[i].x && snake[i-1].y > snake[i].y){
      spriteBody.x = 0;
      spriteBody.y = 0;
    }    

    if(snake[i-1].y < snake[i].y && snake[i+1].x > snake[i].x ||
      snake[i+1].y < snake[i].y && snake[i-1].x > snake[i].x){
      spriteBody.x = 0;
      spriteBody.y = 64;
    } 

    if(snake[i-1].y > snake[i].y && snake[i+1].x < snake[i].x ||
      snake[i+1].y > snake[i].y && snake[i-1].x < snake[i].x){
      spriteBody.x = 128;
      spriteBody.y = 0;
    } 

    if(snake[i-1].x < snake[i].x && snake[i+1].y < snake[i].y ||
      snake[i+1].x < snake[i].x && snake[i-1].y < snake[i].y){
      spriteBody.x = 128;
      spriteBody.y = 128;
    } 

    context.drawImage(
      sprites,
      spriteBody.x, spriteBody.y,
      64, 64,
      snake[i].x, snake[i].y,
      box,box
    );
    
    
  }

  //SNAKE TAIL
  
  let spriteTail= {
    x: 256,
    y: 128
  }

  if(snake[snake.length -2].y < snake[snake.length -1].y){
    spriteTail.x = 192;
    spriteTail.y = 128;
  }
  if(snake[snake.length -2].y > snake[snake.length -1].y){
    spriteTail.x = 256;
    spriteTail.y = 192;
  }
  if(snake[snake.length -2].x < snake[snake.length -1].x){
    spriteTail.x = 192;
    spriteTail.y = 192;
  }
  if(snake[snake.length -2].x > snake[snake.length -1].x){
    spriteTail.x = 256;
    spriteTail.y = 128;
  }

  context.drawImage(
    sprites,
    spriteTail.x, spriteTail.y,
    64, 64,
    snake[snake.length -1].x, snake[snake.length -1].y,
    box,box
  );
}

function createFood(){
  context.drawImage(
    sprites,
    0, 192,
    64, 64,
    food.x, food.y,
    box,box
  );

  for(i=1; i < snake.length; i++){
    if(food.x === snake[i].x && food.y === snake[i].y ){  
      food.x = Math.floor(Math.random() * 15 + 1) * box;
      food.y = Math.floor(Math.random() * 15 + 1) * box;
    }
  }

}

function update(event){
  if(event.keyCode === 37 && direction !== "right") direction = "left";
  if(event.keyCode === 38 && direction !== "down") direction = "up";
  if(event.keyCode === 39 && direction !== "left") direction = "right";
  if(event.keyCode === 40 && direction !== "up") direction = "down";  
}

document.addEventListener("keydown", update);

function playGame(){

  if(snake[0].x >= 16 * box ) snake[0].x = 0;
  if(snake[0].x <= -1 * box ) snake[0].x = 16 * box;
  if(snake[0].y >=16 * box) snake[0].y = 0;
  if(snake[0].y <= -1 * box ) snake[0].y = 16 * box;
  
  for(i=1; i < snake.length; i++){
    if(snake[0].x === snake[i].x && snake[0].y === snake[i].y ){
      clearInterval(jogo);
      alert("PERDEU O JOGO! :(");
    }
  }

  createBackground();
  createSnake();
  createFood();

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
      snakeY += box;
      break; 
    default:
      break;
  }
  
  if(snakeX !== food.x || snakeY !== food.y){
    snake.pop();
  }else{
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  }
  snake.unshift(newHead);
}

const jogo = setInterval(playGame, 100);

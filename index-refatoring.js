window.onload = function(){
  const sprites = new Image();
  sprites.src = "./snake-graphics.png";

  const canvas = document.getElementById("Snake");
  const ctx = canvas.getContext("2d");
  
  const box = 32;  // tamanho dos quadrados
  const boxes = 16; // quantidade des quadrados na area
  const velocity = 1;  
  const snake = {
    x: 1,
    y: 8,
    direction: {
      x: 1,
      y: 0,
    }
  } 

  const food = {
    x: Math.floor(Math.random() * 15 + 1),
    y: Math.floor(Math.random() * 15 + 1), 
  }
  
  const trail = [];
  let tail = 3; 

  setInterval(game, 1000/10); //inicia o jogo

  function game(){
    update();   
    render();
    loop();
  }
  
  document.addEventListener("keydown", moveSnake);
  function moveSnake(e){
    if(e.keyCode === 39 && snake.direction.x !== -1 ) snake.direction = { x: 1, y: 0};
    if(e.keyCode === 40 && snake.direction.y !== -1) snake.direction = { x: 0, y: 1};
    if(e.keyCode === 37 && snake.direction.x !== 1) snake.direction = { x: -1, y: 0};
    if(e.keyCode === 38 && snake.direction.y !== 1) snake.direction = { x: 0, y: -1};
  }

  function update(){      
    
    //move snake head
    snake.x += snake.direction.x;
    snake.y += snake.direction.y;

    // snake atravessa o mapa
    if(snake.x < 0 ) snake.x = boxes - 1;
    if(snake.x > boxes - 1 ) snake.x = 0;
    if(snake.y < 0 ) snake.y = boxes - 1;
    if(snake.y > boxes - 1 ) snake.y = 0;

  }

  function render(){

    //backgorund
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //food
    ctx.drawImage(
      sprites,
      0, 192,
      64, 64,
      food.x * box, food.y * box,
      box,box
    );

    //snake Head
    drawHead();  
    
    //snake body
    ctx.fillStyle = "#ccc";   
    for(i=1; i < trail.length ;i++) {
      ctx.fillRect(trail[i].x * box,trail[i].y * box, box, box);         
    }  
    
    //snake tail
    ctx.fillStyle = "#888";
    if(trail.length)
      ctx.fillRect(trail[0].x * box,trail[0].y * box, box, box)
  }

  function loop(){

    //body colision check
    for(i=0; i < trail.length ;i++) {
      if(trail[i].x === snake.x && trail[i].y === snake.y){
        snake.direction = {
          x:0,
          y:0,
        }  
        alert("GAME OVER");    
      }    
    }

    //snake food check
    if(snake.x === food.x && snake.y === food.y){
      food.x = Math.floor(Math.random() * 15 + 1);
      food.y = Math.floor(Math.random() * 15 + 1);  
      tail++;         
    }
    
    //snake trail update
    trail.push({
      x: snake.x,
      y: snake.y,
    });

    while(trail.length > tail){
      trail.shift();
    }

  }

  function drawHead(){
    let spritePath = {
      x:0,
      y:0
    }     
    const {x, y} = snake.direction;

    if( x === 1) spritePath = { x:256,y:0 } 
    if( x === -1) spritePath = { x:192,y:64 }
    if( y === 1) spritePath = { x:256,y:64 }
    if( y === -1) spritePath = { x:192,y:0 }

    ctx.drawImage(
      sprites,
      spritePath.x, spritePath.y,
      64, 64,
      snake.x * box, snake.y * box,
      box,box
    );

  }
}
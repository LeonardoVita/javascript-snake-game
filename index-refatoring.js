window.onload = function(){
  const canvas = document.getElementById("Snake");
  const ctx = canvas.getContext("2d");
  
  setInterval(game, 1000/10); //inicia o jogo
  
  const box = 32;  // tamanho dos quadrados
  const boxes = 16 // quantidade des quadrados na area
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
  console.log(trail.length)
  let tail = 5;

  function game(){
    update();   
    render();
    loop();
  }

  document.addEventListener("keydown", moveSnake)

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
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * box,food.y * box, box, box);

    //snake Head
    ctx.fillStyle = "#000";
    ctx.fillRect(snake.x * box,snake.y * box, box, box);  
    
    //snake body
    ctx.fillStyle = "#ccc";   
    for(i=0; i < trail.length ;i++) {
      console.log("entrou")
      ctx.fillRect(trail[i].x * box,trail[i].y * box, box, box);         
    }    
  }

  function loop(){

    //body colision check
    for(i=0; i < trail.length ;i++) {
      if(trail[i].x === snake.x && trail[i].y === snake.y){
        snake.direction = {
          x:0,
          y:0,
        }  
        alert("GAME OVER")     
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
 

}
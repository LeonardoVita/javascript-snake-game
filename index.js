window.onload = function(){
  const sprites = new Image();
  sprites.src = "./snake-graphics.png";

  const canvas = document.getElementById("Snake");
  const ctx = canvas.getContext("2d");
  
  const box = 32;  // tamanho dos quadrados
  const boxes = 16; // quantidade des quadrados na area 
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
  let tail = 2; 

  const interval = setInterval(game, 1000/8); //inicia o jogo

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

    //border colision
    // if(snake.x < 0 || snake.x > boxes - 1 || snake.y < 0 || snake.y > boxes - 1){
    //   gameOver();
    // }

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
    drawBody();     
    
    //snake tail
    ctx.fillStyle = "#888";
    if(trail.length)
      drawTail();
  }

  function loop(){

    //body colision check
    for(i=0; i < trail.length ;i++) {
      if(trail[i].x === snake.x && trail[i].y === snake.y){
        snake.direction = {
          x:0,
          y:0,
        }       
        gameOver();    
      }    
    }

    //snake food check
    if(snake.x === food.x && snake.y === food.y){
      let randomX;
      let randomY;
     
      let isClearForDrawFood;
      do{ 
        isClearForDrawFood = true;
        randomX = Math.floor(Math.random() * 15 + 1);
        randomY = Math.floor(Math.random() * 15 + 1);
        for(i=0; i < trail.length; i++){

          if(randomX === trail[i].x && randomY === trail[i].y ){  
            isClearForDrawFood = false;   
            alert("new food 1");
          }

          if(randomX === snake.x && randomY === snake.y){
            isClearForDrawFood = false;
            alert("new food 2");
          }
        }

      }while(!isClearForDrawFood);     

      food.x = randomX;
      food.y = randomY;  
      tail++;         
    }
    
    //snake trail update
    trail.push({
      x: snake.x,
      y: snake.y
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

  function drawTail(){
    let spritePath = {
      x:0,
      y:0
    }      
    const {x,y} = trail[0]
    const {x:nextX, y:nextY} = trail[1] || snake

    if( x < nextX ) spritePath = { x:256,y:128 } 
    if( x > nextX) spritePath = { x:192,y:192 }
    if( y < nextY) spritePath = { x:256,y:192 }
    if( y > nextY) spritePath = { x:192,y:128 }

    ctx.drawImage(
      sprites,
      spritePath.x, spritePath.y,
      64, 64,
      trail[0].x * box, trail[0].y * box,
      box,box
    );
    
  }

  function drawBody(){

    let spritePath = {
      x:0,
      y:0
    } 

    for(i=1; i < trail.length ;i++) {
      let  haveRight = haveLeft = haveUp = haveDown = false; //the adjacent positions

      const { x , y } = trail[i]
      //before position
      let { x: beforeX , y: beforeY } = trail[i-1];  

      //next position
      if( x < beforeX) haveRight = true;
      if( x > beforeX) haveLeft = true;
      if( y > beforeY)  haveUp = true;
      if( y < beforeY)  haveDown = true;  

      //after position
      let { x: afterX , y: afterY } = trail[i+1] || snake;      

      if( x < afterX) haveRight = true;
      if( x > afterX) haveLeft = true;
      if( y > afterY) haveUp = true;
      if( y < afterY) haveDown = true;       

      // console.log({x,y,beforeX,beforeY,afterX,afterY})
      // console.log(haveRight,haveLeft,haveUp,haveDown)      

      //set sprite path
      if( haveLeft && haveRight) spritePath = { x:64,y:0 } 
      if( haveUp && haveDown) spritePath = { x:128,y:64 } 

      if( haveLeft && haveDown) spritePath = { x:128,y:0 } 
      if( haveLeft && haveUp) spritePath = { x:128,y:128 } 
      if( haveRight && haveDown) spritePath = { x:0,y:0 } 
      if( haveRight && haveUp) spritePath = { x:0,y:64 } 
      
      
      ctx.drawImage(
        sprites,
        spritePath.x, spritePath.y,
        64, 64,
        trail[i].x * box, trail[i].y * box,
        box,box
      );

    } 
  }
  
  function gameOver(){

    clearInterval(interval);
    snake.direction={
      x:0,
      y:0
    }
    document.removeEventListener("keydown", moveSnake);

    ctx.fillStyle = "#00000065"
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.font = "30px Comic Sans MS";
    ctx.fillText("Game Over", canvas.width/2 -80, canvas.height/2 - 5);
    setInterval(()=>location.reload(),4000);
  }
}
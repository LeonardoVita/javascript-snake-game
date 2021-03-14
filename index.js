window.onload = function(){
  const sprites = new Image();
  sprites.src = "./snake-graphics.png";

  const canvas = document.getElementById("Snake");
  // const touchPad = document.getElementsByClassName("touch-pad");

  let box;  // tamanho dos quadrados
  const boxes = 16; // quantidade des quadrados na area 

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const screenHalfWidth = screenWidth / 2;
  const screenHalfdHeight = screenHeight / 2;

  if(screenWidth < 512){
    canvas.width  = Math.floor(screenWidth - 10);
    canvas.height = Math.floor(screenWidth - 10);
    box = Math.floor((screenWidth -10 ) / 16);   
  }else{
    canvas.width  = 512;
    canvas.height = 512;
    box = 32    
  }

  const ctx = canvas.getContext("2d");  
  
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
  let tail =2; 

  const interval = setInterval(game, 1000/10); //inicia o jogo

  function game(){
    update();  
    render();
    loop();
  }

  document.addEventListener("touchstart",handleTouchPad)
  function handleTouchPad(event){
    const touchX =  event.touches[0].clientX;
    const touchY =  event.touches[0].clientY;

    if(snake.direction.x !== 0){
      if(touchY < screenHalfdHeight && snake.direction.y !== 1){
        snake.direction = { x: 0, y: -1};
        haveMovementBuffer = true;  
      } 
      else if (touchY > screenHalfdHeight && snake.direction.y !== -1){
        snake.direction = { x: 0, y: 1};
        haveMovementBuffer = true; 
      }
    }
    else if (snake.direction.y !== 0){
      if(touchX < screenHalfWidth && snake.direction.x !== 1){
        snake.direction = { x: -1, y: 0};
        haveMovementBuffer = true;  
      } 
      else if (touchX > screenHalfWidth && snake.direction.x !== -1){
        snake.direction = { x: 1, y: 0};
        haveMovementBuffer = true; 
      }
    } 

    
  }
  
  document.addEventListener("keydown", moveSnake);
  let haveMovementBuffer = false

  function moveSnake(e){
    if(!haveMovementBuffer){
      if(e.keyCode === 39 && snake.direction.x !== -1 ){ 
        snake.direction = { x: 1, y: 0};
        haveMovementBuffer = true;
      }
      else if(e.keyCode === 40 && snake.direction.y !== -1) {
        snake.direction = { x: 0, y: 1};
        haveMovementBuffer = true;
      }
      else if(e.keyCode === 37 && snake.direction.x !== 1) {
        snake.direction = { x: -1, y: 0};
        haveMovementBuffer = true;
      }
      else if(e.keyCode === 38 && snake.direction.y !== 1) {
        snake.direction = { x: 0, y: -1};
        haveMovementBuffer = true;
      }
    }
  }

  function update(){     

    //snake trail update
    trail.push({
      x: snake.x,
      y: snake.y,
      anchor: snake.direction
    });
    
    //move snake head
    snake.x += snake.direction.x;
    snake.y += snake.direction.y;

    // snake atravessa o mapa
    if(snake.x < 0 ) snake.x = boxes - 1;
    else if(snake.x > boxes - 1 ) snake.x = 0;
    else if(snake.y < 0 ) snake.y = boxes - 1;
    else if(snake.y > boxes - 1 ) snake.y = 0;

    //border colision
    // if(snake.x < 0 || snake.x > boxes - 1 || snake.y < 0 || snake.y > boxes - 1){
    //   gameOver();
    // }

  }

  function render(){
   
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.beginPath();

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
    if(trail.length)
      drawBody();     
    
    //snake tail
    ctx.fillStyle = "#888";
    if(trail.length)
      drawTail();

    haveMovementBuffer = false;  
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
          }
          else if(randomX === snake.x && randomY === snake.y){
            isClearForDrawFood = false;
          }
        }

      }while(!isClearForDrawFood);     

      food.x = randomX;
      food.y = randomY;  
      tail++;         
    }    

    while(trail.length > tail){
      trail.shift();
    }

  }

  function drawHead(){
    let spritePath = {
      x:256,
      y:0
    }     
    const {x, y} = snake.direction;

    if( x === 1) spritePath = { x:256,y:0 } 
    else if( x === -1) spritePath = { x:192,y:64 }
    else if( y === 1) spritePath = { x:256,y:64 }
    else if( y === -1) spritePath = { x:192,y:0 }

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
      y:128,
    }   

    const {x,y} = trail[0].anchor

    if( x > 0) spritePath = { x:256,y:128 } 
    else if( x < 0) spritePath = { x:192,y:192 }
    else if( y > 0) spritePath = { x:256,y:192 }
    else if( y < 0) spritePath = { x:192,y:128 }

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
      y:128,
    } 

    for(i=1; i < trail.length ;i++) {
      let  haveRight = haveLeft = haveUp = haveDown = false; //the adjacent positions

      const { x , y } = trail[i].anchor
      let {x:beforeX, y:beforeY} = trail[i-1].anchor 

      //inverte valores
      beforeX *= -1;
      beforeY *= -1;

      //next snake node direction
      if(x > 0) haveRight = true;
      else if(x < 0) haveLeft = true;
      else if(y < 0) haveUp = true;
      else if(y > 0) haveDown = true;
      
      //prev snake node direction
      if(beforeX < 0) haveLeft = true;
      else if(beforeX > 0 ) haveRight = true;
      else if(beforeY < 0) haveUp = true;
      else if(beforeY  > 0) haveDown = true;  

      //set sprite path
      if( haveLeft && haveRight) spritePath = { x:64,y:0 }; 
      else if( haveUp && haveDown) spritePath = { x:128,y:64 }; 
      else if( haveLeft && haveDown) spritePath = { x:128,y:0 };
      else if( haveLeft && haveUp) spritePath = { x:128,y:128 }; 
      else if( haveRight && haveDown) spritePath = { x:0,y:0 }; 
      else if( haveRight && haveUp) spritePath = { x:0,y:64 };       
      
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
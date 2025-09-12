// All The Variables


// GAMESTATES
var PLAY = "running";
var END = "stopped";
var gameState = PLAY;


// TREX
var trex, trex_running, trex_collided;
let fontDino;


// Ground
var ground, invisibleGround, groundImage;
var upcollider;

// Cloud
var cloud, cloudsGroup, cloudImg;


// Obstacles
var obstacle, obstacleGroup;
var obstacle_1, obstacle_2, obstacle_3 ;
var obstacle_4, obstacle_5, obstacle_6 ;


// Score
var score = 0;


// Game Over and Restart
var gameOver, gameOverImg;
var resart, restartImg;


// Spound Variables
var jumpSound , checkPointSound, dieSound;




function preload(){
  
//   The Trex Or the Dinosaur
  trex_running = loadAnimation("img/trex1.png","img/trex3.png","img/trex4.png");
  trex_collided = loadAnimation("img/trex_collided.png");
  
  fontDino = loadFont ("fonts/Dino.ttf");
  

//   The Ground
  groundImage = loadImage("img/ground2.png");
  

// The Cloud
  cloudImg = loadImage("img/cloud.png");
 
  
// The Obstacles
  
  obstacle_1 = loadImage("img/obstacle1.png");
  obstacle_2 = loadImage("img/obstacle2.png");
  obstacle_3 = loadImage("img/obstacle3.png");
  obstacle_4 = loadImage("img/obstacle4.png");
  obstacle_5 = loadImage("img/obstacle5.png");
  obstacle_6 = loadImage("img/obstacle6.png");
 
  
//  Game Over and Restart
  gameOverImg = loadImage("img/gameOver.png");
  restartImg = loadImage("img/restart.png");

  
//  Loading the Sounds
  jumpSound = loadSound("sound/jump.mp3");
  dieSound = loadSound("sound/die.mp3");
  checkPointSound = loadSound("sound/checkPoint.mp3");
  
}




function setup() {


//   Canvas Size
  let cnv = createCanvas(600,200);
  cnv.position(300, 150)
  
//create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  
  
//create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  
//  GameOver  
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
 
  
//   Restart
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  
//creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
 
//  creating upper collider
  upcollider = createSprite(200, 10, 400, 5)
  upcollider.visible = false;
  
//   Setting up the Font
  textFont(fontDino);

  
//   The Score
  score = 0;
 
  
// Creating Groups: Ostacles and Clouds
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
}



function draw() {
  
//set background color
  background(255);
  
//   Score
  textSize = 20;
  text( score, 450,50);

//   If the GameState is playing
  
  if (gameState === PLAY){
  
// Moving the Ground 
   ground.velocityX = -(6 + 3*score/100);
  
    
// The Score to Increase
    score = score + Math.round(getFrameRate()/60);
    
// Checkpoint Sounds
  if (score > 0 && score % 250 === 0){
    checkPointSound.play();
  }
  
    
//   Unlimited Ground
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
   
    
// Making the dino jump when the keys are pressed
  
  if(keyDown("space") && trex.y >= 159) {
    trex.velocityY = -12;
    jumpSound.play();    
  }
  
  if(keyDown("up") && trex.y >= 159) {
    trex.velocityY = -12;
    jumpSound.play();
  }
   
// Making the dino jumpwith touch sensitivity
    if(touches.length > 0 && trex.y  <= 170) {
      jumpSound.play()
      trex.velocityY = -12;
      touches = [];
    }
    
// Gravity to pull down the TREX
  trex.velocityY = trex.velocityY + 0.8;
  trex.setCollider("circle", 0, 0, 30);
    
//Spawn Clouds and Objects(Calling the Function)
  trex.collide(invisibleGround);
  trex.collide(upcollider);
  spawnClouds();
  spawnObstacles();
   
    
// To check if the game is over
  if (obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  
  }
    
}
  
  
   
// If the game is stopped   
  
  else if (gameState === END){
  
    
//     Everything will be not moving
    ground.velocityX = 0;
    trex.velocityY = 0;

    
//   Setting lifetime of the object so that they dont disappear
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
       
//     The Clouds and the obstacle stops moving
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  
    
// Visiblity of The Gameover
    gameOver.visible = true;
    restart.visible =  true;
    
    
//change the trex animation to collided
      trex.changeAnimation("collided", trex_collided); 
   
  // Calling the reset function   
  if (mousePressedOver(restart) || keyDown("space")) {
    reset();
  }

// Calling the reset function with touch sensitivity
  if(touches.length>0) {      
    reset();
    touches = []
}
    
}
      
  
//stop trex from falling down
  trex.collide(invisibleGround);
  trex.collide(upcollider);
  
// Draws all the Sprites
  drawSprites();

}


// The reset functions resets the game
function reset(){
  
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  gameOver.visible =false;
  restart.visible = false;
  score = 0;
  
}


function spawnClouds(){

  if(frameCount % 60 === 0){
    
  
    var cloud = createSprite(600, 120 ,40 ,10);
    cloud.addImage(cloudImg)

    cloud.scale = 0.8;

    cloud.y = Math.round(random(80, 120))
    cloud.velocityX= -3;

    cloud.lifetime = 200;

    console.log(cloud.depth);

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1; 
    
    cloudsGroup.add(cloud);
    
  }
}



function spawnObstacles(){
  
  if(frameCount % 60 === 0){
    
  
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    var rmd = Math.round(random(1, 6));
 
    
    switch (rmd){
      
      case 1: obstacle.addImage(obstacle_1);
        break;
      
      case 2: obstacle.addImage(obstacle_2);
        break;
      
      case 3: obstacle.addImage(obstacle_3)
        break;
      
      case 4: obstacle.addImage(obstacle_4);
        break;
      
      case 5: obstacle.addImage(obstacle_5);
        break;
      
      case 6: obstacle.addImage(obstacle_6);
        break;
        
      default:
        break;
    }
 
    obstaclesGroup.add(obstacle);
    
  }

}


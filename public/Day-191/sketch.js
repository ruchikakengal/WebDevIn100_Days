var monkey , monkey_running
var banana ,bananaImage, obstacle, obstacleImage
var bananaGroup, obstacleGroup
var score
var ground
var backImg, backgr


function preload(){
  backImg = loadImage("img/jungle.jpg")
  
  monkey_running = loadAnimation("img/Monkey_01.png","img/Monkey_02.png","img/Monkey_03.png","img/Monkey_04.png","img/Monkey_05.png","img/Monkey_06.png","img/Monkey_07.png","img/Monkey_08.png","img/Monkey_09.png","img/Monkey_10.png");
  bananaImage = loadImage("img/banana.png");
  obstacleImage = loadImage("img/obstacle.png");

}



function setup() {
cnv = createCanvas(800, 400)

// Background
backgr=createSprite(0,0);
backgr.addImage(backImg);
backgr.scale=1.5;
backgr.x=backgr.width/2;
backgr.velocityX=-4;

// creating player
monkey = createSprite(60,315,20,20);
monkey.addAnimation("moving", monkey_running);
monkey.scale = 0.1

// creating ground
ground = createSprite(400,350,900,10);
ground.velocityX = -4;
ground.x = ground.width/2;
ground.visible = false;

// Groups
bananaGroup = new Group();
obstacleGroup = new Group();
  
score = 0;
}


function draw() {
  background(225)
    
  if (ground.x < 0){
      ground.x = ground.width/2;
  }


  if(backgr.x<100){
    backgr.x=backgr.width/2;
  }


  if(bananaGroup.isTouching(monkey)){
    bananaGroup.destroyEach();
    score = score + 2
  }
  
  switch(score){
    case 10: monkey.scale=0.12;
            break;
    case 20: monkey.scale = 0.14;
            break;
    case 30: monkey.scale = 0.15;
            break;
    case 40: monkey.scale = 0.16;
            break;
    case 50: monkey.scale = 0.18
            break;
    default: break;
  }

  if(obstacleGroup.isTouching(monkey)){
    score = score - 5
    obstacleGroup.destroyEach();
  }

  if(keyDown("space") && monkey.y >= 100) {
    monkey.velocityY = -10;
 }

  monkey.velocityY = monkey.velocityY + 0.8
  monkey.collide(ground);

  food();
  obstacles();

  drawSprites() 
  
  //    writing code for score   
  stroke("white");
  textSize(20);
  fill("white");
  text("Score:"+ score ,20,30);

}

function food(){
  if (frameCount % 110 === 0){
    banana = createSprite(600,165,10,40);
    banana.y = Math.round(random(120, 200))
    banana.addImage("image" ,bananaImage)
    banana.velocityX = -5
    banana.lifetime = 130
    banana.scale = 0.05
    monkey.depth = banana.depth + 1
    bananaGroup.add(banana);
  }
}

function obstacles(){
  if (frameCount % 350 === 0){
    obstacle = createSprite(400,320,10,40)
    obstacle.addImage("image" ,obstacleImage)
    obstacle.velocityX = -5;
    obstacle.scale = 0.2;
    obstacle.lifetime = 120;
    
    obstacleGroup.add(obstacle);
  }
}
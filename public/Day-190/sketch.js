var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "play"

function preload(){
  towerImg = loadImage("img/tower.png");
  doorImg = loadImage("img/door.png");
  climberImg = loadImage("img/climber.png");
  ghostImg = loadImage("img/ghost-standing.png");
}

function setup(){
  createCanvas(600,600);
  tower = createSprite(300,300);
  tower.addImage("tower",towerImg);
  tower.velocityY = 1;
 
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();
 
  ghost = createSprite(200,200,50,50);
  ghost.scale = 0.3;
  ghost.addImage("ghost", ghostImg);
}

function draw(){
  background(0);
  if (gameState === "play") {
    if(keyDown("a")){
      ghost.x = ghost.x - 3;
    }
   
    if(keyDown("d")){
      ghost.x = ghost.x + 3;
    }
   
    if(keyDown("space")|| keyDown("w")){
      ghost.velocityY = -10;
    }
   
    ghost.velocityY = ghost.velocityY + 0.8
   
    if(tower.y > 400){
      tower.y = 300
    }
    spawnDoors();

   
    //climbersGroup.collide(ghost);
    if(climbersGroup.isTouching(ghost)){
      ghost.velocityY = 0;
    }

    if(invisibleBlockGroup.isTouching(ghost) || ghost.y > 600){
      ghost.destroy();
      gameState = "end"
    }
   
    drawSprites();
  }
 
  if (gameState === "end"){
    stroke("yellow");
    fill("yellow");
    textSize(30);
    text("Game Over", 230,250)
    
  }

}

function spawnDoors() {
  //write code here to spawn the doors in the tower
  if (frameCount % 240 === 0) {
    var door = createSprite(200, -50);
    var climber = createSprite(200,10);
    var invisibleBlock = createSprite(200,15);
    invisibleBlock.width = climber.width;
    invisibleBlock.height = 2;
   
    door.x = Math.round(random(120,400));
    climber.x = door.x;
    invisibleBlock.x = door.x;
   
    door.addImage(doorImg);
    climber.addImage(climberImg);
   
    door.velocityY = 1;
    climber.velocityY = 1;
    invisibleBlock.velocityY = 1;
   
    ghost.depth = door.depth;
    ghost.depth +=1;
   
    //assign lifetime to the variable
    door.lifetime = 800;
    climber.lifetime = 800;
    invisibleBlock.lifetime = 800;

   
    //add each door to the group
    doorsGroup.add(door);
    invisibleBlock.debug = true;
    climbersGroup.add(climber);
    invisibleBlockGroup.add(invisibleBlock);
  }
}
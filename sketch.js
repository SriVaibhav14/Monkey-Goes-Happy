var monkey, monkey_running, monkey_collided;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var survivalTime, score,death;
var backgroundImg;
var gameOver,goImg;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  monkey_collided = loadAnimation("sprite_7.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  backgroundImg = loadImage("jungle.jpg");
  goImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(windowWidth ,windowHeight);
  monkey = createSprite(50,315,20,20);
  monkey.addAnimation("running", monkey_running);
  monkey.scale=0.1;
  //monkey.depth = background.depth+1;
  //monkey.debug=true;
  
  ground = createSprite(width/2,windowHeight-50,width,2);
  ground.velocityX=-4;
  ground.visible = false;
  console.log(ground.x);
  
  survivalTime = 0;
  score = 0;
  death = 0;
  
  FoodGroup=createGroup();
  obstacleGroup=createGroup();
}

function draw() {
  background(backgroundImg);
  stroke("white");
  fill("white");
  textSize(13);
    
  monkey.collide(ground);
  
  if(gameState===PLAY){
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    if(touches.length > 0 || keyDown("SPACE") && monkey.y  >= height-100) {
        monkey.velocityY = -17;
        touches = [];
      }

    if(FoodGroup.isTouching(monkey)){
        score = score+1;
        FoodGroup.destroyEach();
      }
    switch(score){
        case 10: monkey.scale=0.11;
                break;
        case 20: monkey.scale=0.12;
                break;
        case 30: monkey.scale=0.13;
                break;
        case 40: monkey.scale=0.14;
                break;
        default: break;
    }

    if(obstacleGroup.isTouching(monkey)){
        monkey.scale = 0.1;
        death = death+1;
      }
    
    if(death === 2){
      gameState = END;
    }
    
    if(gameState === END){
      obstacleGroup.destroyEach();
      FoodGroup.destroyEach();
      
      obstacleGroup.setVelocityXEach(0);
      FoodGroup.setVelocityXEach(0);
      
      monkey.velocityY = 0;
      monkey.visible = false;
      ground.velocityX = 0;
      
      background("white");
      
      gameOver = createSprite(width/2,height/2,0,0);
      gameOver.addImage(goImg);
      gameOver.scale = 0.7;
      gameOver.depth = background.depth+1;
    }

    monkey.velocityY = monkey.velocityY + 0.8;

    spawnBanana();
    spawnObstacles();
  }
  
  drawSprites();
  text("Survival Time : "+ survivalTime, width-150,50);
  text("Score : "+ score, width-150,70);
}

function spawnBanana(){
  if(frameCount % 80 ===0){
    banana = createSprite(450,180,20,20);
    banana.y=Math.round(random((windowHeight/2)-10,(windowHeight/2)+90)),
    banana.addImage(bananaImage);
    banana.velocityX=-(6 + 3*score/100);
    banana.scale=0.1;
    banana.lifetime=400;
    
    monkey.depth = banana.depth+1;
    FoodGroup.add(banana);
  }
}

function spawnObstacles(){
  if(frameCount % 300 === 0){
    obstacle = createSprite(400,ground.y-25,20,20);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX=-(3 + 3*score/100);
    obstacle.scale=0.125;
    obstacle.lifetime=200;
    
    obstacle.depth = monkey.depth+1;
    obstacleGroup.add(obstacle);
  }
}
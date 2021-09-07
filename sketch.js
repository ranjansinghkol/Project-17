var path, mainCyclist;
var player1, player2, player3;
var pathImg, mainRacerImg1, mainRacerImg2;

var oppPink1Img, oppPink2Img;
var oppYellow1Img, oppYellow2Img;
var oppRed1Img, oppRed2Img;
var gameOverImg, cycleBell;

var obs, obsGroup, obs1, obs2, obs3;

var pinkCG, yellowCG, redCG;

var END = 0;
var PLAY = 1;
var gameState = PLAY;

var distance = 0;
var gameOver, restart;

function preload() {
  pathImg = loadImage("images/Road.png");
  mainRacerImg1 = loadAnimation("images/mainPlayer1.png", "images/mainPlayer2.png");
  mainRacerImg2 = loadAnimation("images/mainPlayer3.png");

  oppPink1Img = loadAnimation("images/opponent1.png", "images/opponent2.png");
  oppPink2Img = loadAnimation("images/opponent3.png");

  oppYellow1Img = loadAnimation("images/opponent4.png", "images/opponent5.png");
  oppYellow2Img = loadAnimation("images/opponent6.png");

  oppRed1Img = loadAnimation("images/opponent7.png", "images/opponent8.png");
  oppRed2Img = loadAnimation("images/opponent9.png");

  cycleBell = loadSound("bell.mp3");
  gameOverImg = loadImage("images/gameOver.png");

  obs1 = loadImage("images/obstacle1.png");
  obs2 = loadImage("images/obstacle2.png");
  obs3 = loadImage("images/obstacle3.png");
}

function setup(){
  createCanvas(1200, 300);
  // Moving background
  path = createSprite(100, 150);
  path.addImage(pathImg);
  path.velocityX = -5;

  //creating boy running
  mainCyclist = createSprite(70, 150);
  mainCyclist.addAnimation("Collided", mainRacerImg2)
  mainCyclist.addAnimation("SahilCycling", mainRacerImg1);
  mainCyclist.scale = 0.07;

  //mainCyclist.debug = true;
  mainCyclist.setCollider("rectangle", 0, 0, mainCyclist.width-10, mainCyclist.height-10);

  gameOver = createSprite(650, 150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  pinkCG = new Group();
  yellowCG = new Group();
  redCG = new Group();
  obsGroup = new Group();
}

function draw(){
  background(0);

  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: " + distance, 900, 30);

  if(gameState === PLAY){
    distance = distance + Math.round(getFrameRate() / 50);
    path.velocityX = -(6 + 2 * distance / 150);

    mainCyclist.y = World.mouseY;

    mainCyclist.changeAnimation("SahilCycling", mainRacerImg1);

    edges = createEdgeSprites();
    mainCyclist.collide(edges);

    //code to reset the background
    if (path.x < 0) {
      path.x = width / 2;
    }

    //code to play cycle bell sound
    if (keyDown("space")) {
      cycleBell.play();
    }

    //creating continous opponent players
    var select_oppPlayer = Math.round(random(1, 4));

    if (World.frameCount % 150 == 0) {
      switch(select_oppPlayer){
        case 1:
          pinkCyclists();
          break;
        case 2:
          yellowCyclists();
          break;
        case 3:
          redCyclists();
          break;
        case 4:
          createObstacles();
          break;
        default:
          break;
      }
    }

    if (pinkCG.isTouching(mainCyclist)) {
      gameState = END;
      player1.velocityY = 0;
      player1.addAnimation("opponentPlayer1", oppPink2Img);
    }

    if (yellowCG.isTouching(mainCyclist)) {
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2", oppYellow2Img);
    }

    if (redCG.isTouching(mainCyclist)) {
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3", oppRed2Img);
    }
    if(mainCyclist.isTouching(obsGroup)){
      gameState = END;
      
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    
    text("Click on Screen to restart the game.", 500, 200);

    path.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.changeAnimation("Collided", mainRacerImg2)

    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);

    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);

    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);

    obsGroup.setVelocityXEach(0);
    obsGroup.setLifetimeEach(-1);
  }
}

function mouseClicked(){
  if(gameState == PLAY){
    cycleBell.play();
  }
  if(gameState == END){
    distance = 0;
    gameState = PLAY;
    mainCyclist.changeAnimation("SahilCycling", mainRacerImg1);
    pinkCG.destroyEach();
    redCG.destroyEach();
    yellowCG.destroyEach();
    obsGroup.destroyEach();
    gameOver.visible = false;
  }
}

function pinkCyclists() {
  player1 = createSprite(1100, Math.round(random(50, 250)));
  player1.scale = 0.06;
  player1.velocityX = -(6 + 2 * distance / 150);
  player1.addAnimation("opponentPlayer1", oppPink1Img);
  player1.lifetime = 170;
  pinkCG.add(player1);
}

function yellowCyclists() {
  player2 = createSprite(1100, Math.round(random(50, 250)));
  player2.scale = 0.06;
  player2.velocityX = -(6 + 2 * distance / 150);
  player2.addAnimation("opponentPlayer2", oppYellow1Img);
  player2.lifetime = 170;
  yellowCG.add(player2);
}

function redCyclists() {
  player3 = createSprite(1100, Math.round(random(50, 250)));
  player3.scale = 0.06;
  player3.velocityX = -(6 + 2 * distance / 150);
  player3.addAnimation("opponentPlayer3", oppRed1Img);
  player3.lifetime = 170;
  redCG.add(player3);
}

function createObstacles(){
  obs = createSprite(1100, Math.round(random(50, 250)));
  var obsImgs = Math.round(random(1, 3));
  switch(obsImgs){
    case 1:
      obs.addImage(obs1);
      break;
    case 2:
      obs.addImage(obs2);
      break;
    case 3:
      obs.addImage(obs3);
      break;
    default:
      break;
  }
  obs.scale = 0.1;
  obs.velocityX = -(6 + 2 * distance / 150);
  obs.lifetime = 170;
  obs.depth = mainCyclist.depth;
  mainCyclist.depth ++;
  obsGroup.add(obs);
}
class Cactus{
    constructor(x){
        this.canGivePoints = true;
        this.speed = 10
        this.x = x;
        this.y = Game.ground();
        this.height = round(random(2, 4));
        this.dy = map(this.height, 2, 4, height*-0.15, height*-0.3);
        if(this.height === 2){
          this.sprite = iEnemy2;
        }else if(this.height === 3){
          this.sprite = iEnemy3;
        }else{
          this.sprite = iEnemy4;
        }
        this.dx = width*0.0333333333;
    }
    move(){
      if (this.x > -400){
          this.x -= this.speed;
      }
      else{
          this.canGivePoints = true;
          this.x = width + random(0+this.speed*10, 400+this.speed*10+width/4);
          this.height = round(random(2, 4));  //random(-200, -50);
          this.dy = map(this.height, 2, 4, height*-0.15, height*-0.3);
          if(this.height === 2){
            this.sprite = iEnemy2;
          }else if(this.height === 3){
            this.sprite = iEnemy3;
          }else{
            this.sprite = iEnemy4;
          }
      }
    }

    render(){
      image(this.sprite,this.x, this.y, -this.dx, this.dy)
      // push()
      // noFill()
      // stroke(255, 0, 100)
      // strokeWeight(3)
      // rect(this.x, this.y, -this.dx, this.dy)
      // pop()
    }

    collision(dino, justReturn=false){
      this.speed = dino.score/10 + width*0.0083333333
      if(this.x < dino.x + dino.dx/2 + dino.dx && this.x + this.dx > dino.x + this.dx){
        if(this.canGivePoints){
          dino.score += 1;
          this.canGivePoints = false;
        }
        if(this.y > dino.y + dino.dy + dino.dy/2 && this.y + this.dy < dino.y){
          if(justReturn){
            return true;
          }else{
            gameOver(dino)
          }
        }
      }
      if(justReturn){
        return false;
      }
    }
}

function gameOver(dino){
  let buff = ""
  if(round(dino.score) > gameState.lowScore){
    let allReadyIn = false;
    let min = Infinity;
    let us = NaN;


    for(var key in gameState.highScoreData){
      if(gameState.name == key){
        allReadyIn = true;
      }
      if(gameState.highScoreData[key] < min){
        us = key;
        min = gameState.highScoreData[key];
      }
    }
    if(!allReadyIn){
      delete gameState.highScoreData[us]
    }
    gameState.highScoreData[gameState.name] = round(dino.score)
    gameState.highScore = round(dino.score);
    gameState.highScoreData = sort_object(gameState.highScoreData)
    for(var key in gameState.highScoreData){
      buff += key+":"+str(gameState.highScoreData[key])+" "
    }
    console.log(buff)
    setCookie("highScore", buff);
    buff = buff.replace(/ /g, "\n")
  }
  if(buff == ""){
    for(var key in gameState.highScoreData){
      buff += key+":"+str(gameState.highScoreData[key])+" "
    }
    buff = buff.replace(/ /g, "\n")
  }
  if(sound){
    if(!sDamage.isPlaying()){
      sDamage.play();
    }
  }

  background(0);
  image(iGameover,0,0,width,height);
  push();
  textSize(40);
  fill(255);
  text("score: "+round(dino.score), 50, height/2-25);
  text("high score: "+gameState.highScore, 50, height/2+25);
  text("score board:", width-width/4, height/2-25)
  buff = buff.replace(/:/g, "\t=\t")
  text(buff, width-width/4, height/2+25)
  pop();
  dino.run = false;
}

function sort_object(obj) {
  var keys = [];
  for(var key in obj) {
   keys[keys.length] = key;
  }
  var values = [];
  for(var i = 0; i < keys.length; i++) {
     values[values.length] = obj[keys [i]];
  }
  var sortedValues = values.sort(function(a, b){
    return b - a;
  });
  newDict = {}
  for(var i = 0; i < values.length; i++){
    newDict[getKeyByValue(obj, values[i])] = values[i]
  }
  console.log(newDict);
  return newDict
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

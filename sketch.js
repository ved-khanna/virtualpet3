var dog,happydog
var database, foodS, foodStock 

var feedDog, addFood

var lastFed, fedTime 

var foodOBJ
var gameState,readState
var garden,washroom,bedroom

function preload()
{
  regDog=loadImage("Dog.png")
  happyDog=loadImage("happydog.png")
  garden=loadImage("Garden.png")
  bedroom=loadImage("Bed Room.png")
  washroom=loadImage("Wash Room.png")
}

function setup() {
	createCanvas(500, 500);
  database = firebase.database();
  foodOBJ= new Food() 
  dog = createSprite(250,250,20,30)
  dog.addImage(regDog)
  dog.scale=0.1
  foodStock=database.ref('food')
  foodStock.on("value",readStock)
  feedDog=createButton("Feed the dog")
  feedDog.position(230,400)
  feedDog.mousePressed(feedTheDog)
  addFood=createButton("Add food")
  addFood.position(270,400)
  addFood.mousePressed(AddFood)
  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val()
  })
}


function draw() {  
  background(46, 139, 87)
  fedTime=database.ref('feedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  })
  fill(255,255,254)
  textSize(15)
  if (currentTime==lastFed+1) {
    update("playing")
    foodOBJ.garden()
  }
  else if(currentTime==lastFed+2){
    update("sleeping")
    foodOBJ.bedroom()
  }
  else if(currentTime>lastFed+2&&currentTime<=lastFed+4){
   update("bathing")
   foodOBJ.washroom()
  }
  else{
    update("hungry")
    foodOBJ.display()
  }
if (gameState!="hungry") {
  feed.hide()
  addFood.hide()
  dog.remove()
  
} else {
  feed.show()
  addFood.show()
  dog.addImage("regDog")
}
drawSprites();
  //add styles here
}

function readStock(data){
  foodS=data.val()
  foodOBJ.updateFoodStock(foodS)
}
/*function writeStock(x) {
  database.ref('/').update({
    food:x
  })
  
}*/
function FedDog() {
  dog.addImage(happydog)
  if (foodOBJ.getFoodStock()<=0) {
    foodOBJ.updateFoodStock(foodOBJ.getFoodStock()*0)
  }
  else{ foodOBJ.updateFoodStock(foodOBJ.getFoodStock()*-1)}
  database.ref('/').update({
    food:foodOBJ.getFoodStock(),
    fedTime:hour()
  })
}
function addFoods() {
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}





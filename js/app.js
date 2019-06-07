'use strict';

var votesLeft = 25;

var voteBox = document.getElementById ('img-container');
var submitButton = document.getElementById ('submit');
var item1El = document.getElementById ('item1');
var item2El = document.getElementById ('item2');
var item3El = document.getElementById ('item3');

var allItems = [];

function Item (name){
  this.name = name;
  this.filepath = `img/${name}.jpg`;
  this.views = 0;
  this.votes = 0;

  allItems.push(this);
}

var itemsNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn','usb','water-can','wine-glass'];

for (var i = 0; i<itemsNames.length; i++){
  new Item (itemsNames[i]);
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var recentRandomNumbers = [];
var randomIndex;
function dealWithRandomIndex () {
  randomIndex = random (0, allItems.length-1);
  while(recentRandomNumbers.includes(randomIndex)){
    randomIndex = random(0, allItems.length-1);
  }

  if(recentRandomNumbers.length > 9){
    recentRandomNumbers.shift();
  }

  recentRandomNumbers.push(randomIndex);
  allItems[randomIndex].views++;
}

function render () {
  
  dealWithRandomIndex();

  var imgPart1 = item1El.firstChild;
  var radioPart1 = item1El.lastChild;

  imgPart1.src = allItems[randomIndex].filepath;
  imgPart1.alt = imgPart1.title = radioPart1.value = allItems[randomIndex].name;
  

  dealWithRandomIndex();
  //In the future possible to change all imagpart2 and part 3(and radio) to imgPart1 and make a function
  var imgPart2 = item2El.firstChild;
  var radioPart2 = item2El.lastChild;
  
  imgPart2.src = allItems[randomIndex].filepath;
  imgPart2.alt = imgPart2.title =  radioPart2.value = allItems[randomIndex].name;

  dealWithRandomIndex();

  var imgPart3 = item3El.firstChild;
  var radioPart3 = item3El.lastChild;
  
  imgPart3.src = allItems[randomIndex].filepath;
  imgPart3.alt = imgPart3.title = radioPart3.value = allItems[randomIndex].name;
}

// voteBox.addEventListener('click', handleClick);

submitButton.addEventListener('click', handleClick);

function handleClick(e){
  e.preventDefault();

  
  var itemName = e.target.value;


if((item1El.lastChild.checked !== true) & (item2El.lastChild.checked !== true)&(item3El.lastChild.checked !== true)){
   alert('Please make a choice!');
  }


  // if(votesLeft === 0){
  // submitButton.removeEventListener('submit', handleSubmit);
  // //   // render the results to the DOM
  // //   renderBestItem();
  // // }

  // for(var i = 0; i < allItems.length; i++){
  //   if(itemName === allItems[i].name){
  //     allitems[i].votes++;
  //     votesLeft--;
  //   }
  // }
  item1El.lastChild.checked = item2El.lastChild.checked = item3El.lastChild.checked = "";
   
  render();
}

render();

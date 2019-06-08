'use strict';

var votesLeft = 1;
var voteContainer = document.getElementById ('img-container');
var item1El = document.getElementById ('item1');
var item2El = document.getElementById ('item2');
var item3El = document.getElementById ('item3');
var submitButton = document.getElementById ('submit');
var alertUser = document.getElementById('alertUser');
var resultsEl = document.getElementById ('results');
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

function createSrcAltTitleValue (itemEl){
  itemEl.firstChild.src = allItems[randomIndex].filepath;
  itemEl.firstChild.alt = itemEl.firstChild.title = itemEl.lastChild.value = allItems[randomIndex].name;
}

function render () {
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item1El);
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item2El);
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item3El);

}

function collectingVotes(itemEl){
  if (itemEl.lastChild.checked === true){
    alertUser.style.color = 'black';
    alertUser.textContent = 'Please select one item that you mostlikely buy.';
    
    for(var i = 0; i < allItems.length; i++){
      if (itemEl.lastChild.value === allItems[i].name){
        allItems[i].votes++;
        votesLeft--;
      }
    }
  }
}

function renderBestItem() {
  var bestItem;
  var temp = 0;

  for(var i = 0; i < allItems.length; i++){
    if(allItems[i].votes > temp){
      temp = allItems[i].votes;
      bestItem = allItems[i];
    }
  }
  
  alertUser.textContent = `The Best Item is:`;

  var imgEl = document.createElement('img');
  imgEl.src = bestItem.filepath;
  imgEl.alt = imgEl.title = bestItem.name;

  var h3ElVotes = document.createElement('h3');
  h3ElVotes.textContent = `Votes: ${bestItem.votes}`;

  var h3ElViews = document.createElement('h3');
  h3ElViews.textContent = `Views: ${bestItem.views}`;

  resultsEl.appendChild(imgEl);
  resultsEl.appendChild(h3ElVotes);
  resultsEl.appendChild(h3ElViews);
}

submitButton.addEventListener('click', handleClick);

function handleClick(){
   
  if((item1El.lastChild.checked !== true) & (item2El.lastChild.checked !== true)&(item3El.lastChild.checked !== true)){
    alertUser.style.color = 'red';
    alertUser.textContent = 'Please choose 1 item!';
    return;
  }

  collectingVotes(item1El);
  collectingVotes(item2El);
  collectingVotes(item3El);

  if(votesLeft === 0){
    submitButton.removeEventListener('click', handleClick);
        renderBestItem();
        voteContainer.style.opacity = 0.25;
  }
  

  item1El.lastChild.checked = item2El.lastChild.checked = item3El.lastChild.checked = '';
   
  render();
}

render();

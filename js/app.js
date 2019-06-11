'use strict';

var votesLeft = 5;
var voteContainer = document.getElementById ('img-container');
var item1El = document.getElementById ('item1');
var item2El = document.getElementById ('item2');
var item3El = document.getElementById ('item3');
var submitButton = document.getElementById ('submit');
var alertUser = document.getElementById('alertUser');
var resultsEl = document.getElementById ('results');
var allItems = [];

//object constructor function for our img
function Item (name){
  this.name = name;
  this.filepath = `img/${name}.jpg`;
  this.views = 0;
  this.votes = 0;

  allItems.push(this);
}
//img file names
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

var h3ElVotesLeft = document.createElement('h3');

function collectingVotes(itemEl){
  if (itemEl.lastChild.checked === true){
    alertUser.style.color = 'black';
    alertUser.textContent = 'Please select one item that you mostlikely buy.';
    
    for(var i = 0; i < allItems.length; i++){
      if (itemEl.lastChild.value === allItems[i].name){
        allItems[i].votes++;
        votesLeft--;
        
        h3ElVotesLeft.textContent = `Votes left: ${votesLeft}`;
        resultsEl.appendChild(h3ElVotesLeft);
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
  
  resultsEl.removeChild(h3ElVotesLeft);

  alertUser.textContent = `The Best Item is: ${bestItem.name}`;
  
  var imgEl = document.createElement('img');
  imgEl.src = bestItem.filepath;
  imgEl.alt = imgEl.title = bestItem.name;

  var h3ElVotes = document.createElement('h3');
  h3ElVotes.textContent = `Votes: ${bestItem.votes}`;

  var h3ElViews = document.createElement('h3');
  h3ElViews.textContent = `Views: ${bestItem.views}`;

  var voteRatio = (bestItem.votes/bestItem.views)*100;
  var h3ElVoteRatio = document.createElement('h3');
  h3ElVoteRatio.textContent = `Vote Coefficient: ${voteRatio}%`;

  resultsEl.appendChild(imgEl);
  resultsEl.appendChild(h3ElVotes);
  resultsEl.appendChild(h3ElViews);
  resultsEl.appendChild(h3ElVoteRatio);

  var ulEl = document.createElement('ul');
  for (i = 0; i < allItems.length; i++){
    var liEl = document.createElement('li');
    liEl.textContent = `${allItems[i].name}: ${allItems[i].votes} votes /  ${allItems[i].views} views`;
    ulEl.appendChild(liEl);
  }

  resultsEl.appendChild(ulEl);

}

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
    renderChart();
  }  
  item1El.lastChild.checked = item2El.lastChild.checked = item3El.lastChild.checked = '';
  render();
}
submitButton.addEventListener('click', handleClick);

render();

function renderChart() {
  var votesArray = [];
  for (i = 0; i < allItems.length; i++){
    votesArray.push(allItems[i].votes);
  }

  var ctx = document.getElementById('myChart').getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'bar',
      
    data: {
      labels: itemsNames,
      datasets: [{
        label: '# of Votes',
        data: votesArray,
        backgroundColor:'rgba(255, 99, 132, 0.2)',
          
        borderColor:'rgba(255, 99, 132, 1)',
          
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
          
    }
  });
  myChart.canvas.parentNode.style.height = '400px';
  myChart.canvas.parentNode.style.width = '1200px';
}

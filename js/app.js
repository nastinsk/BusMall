'use strict';

var votesLeft = 25;
var voteContainer = document.getElementById ('img-container');
var item1El = document.getElementById ('item1');
var item2El = document.getElementById ('item2');
var item3El = document.getElementById ('item3');
var submitButton = document.getElementById ('submit');
var alertUser = document.getElementById('alertUser');
var resultsEl = document.getElementById ('results');
var allItems = [];

alertUser.textContent = `Please select one item that you most likely buy. You have ${votesLeft} votes.`;

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

//creatimg object instances with Item constructor
for (var i = 0; i<itemsNames.length; i++){
  new Item (itemsNames[i]);
}

//helper function for random number
function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function that chooses objects indexes so we could display imgs randomly
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

//function to create src alt title and vaalue for html elements
function createSrcAltTitleValue (itemEl){
  itemEl.firstChild.src = allItems[randomIndex].filepath;
  itemEl.firstChild.alt = itemEl.firstChild.title = itemEl.lastChild.value = allItems[randomIndex].name;
}

//displays all information on the html page
function render () {
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item1El);
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item2El);
  
  dealWithRandomIndex();
  createSrcAltTitleValue(item3El);
}

var h3ElVotesLeft = document.createElement('h3'); //creates h3 element in result section that will store votes that left

//function that collect votes for each item that was displayed and alerts user about votes are left
function collectingVotes(itemEl){
  if (itemEl.lastChild.checked === true){
    alertUser.style.color = 'black';
    alertUser.textContent = 'Please select one item that you mostlikely buy.';
    
    for(var i = 0; i < allItems.length; i++){
      if (itemEl.lastChild.value === allItems[i].name){
        allItems[i].votes++;
        votesLeft--;
        localStorage.removeItem('votesLeft'); //clear the old data from local storage
        //adds a renewed votesleft in local storage
        var stringVotesLeft = JSON.stringify(votesLeft);
        localStorage.setItem('votesLeft', stringVotesLeft);
       
        h3ElVotesLeft.textContent = `Votes left: ${votesLeft}`;
        resultsEl.appendChild(h3ElVotesLeft);
      }
    }
  }
}

//function to find out what is the item with the most votes, and display this item with votes/views and votes cofficient
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
  voteRatio = Number.parseFloat(voteRatio).toFixed(2); //this code from MDN, helps to reduce the lenght of the number
  var h3ElVoteRatio = document.createElement('h3');
  h3ElVoteRatio.textContent = `Vote Coefficient: ${voteRatio}%`;

  resultsEl.appendChild(imgEl);
  resultsEl.appendChild(h3ElVotes);
  resultsEl.appendChild(h3ElViews);
  resultsEl.appendChild(h3ElVoteRatio);
  //creates list where at the end all items from the allItems array will be displayed with their votes and views
  var ulEl = document.createElement('ul');
  for (i = 0; i < allItems.length; i++){
    var liEl = document.createElement('li');
    liEl.textContent = `${allItems[i].name}: ${allItems[i].votes} votes /  ${allItems[i].views} views`;
    ulEl.appendChild(liEl);
  }

  resultsEl.appendChild(ulEl);
}
//function to add chart after user made 25 votes
function renderChart() {
  var h2El = document.getElementById('resultsChart');
  h2El.textContent = 'Results Chart:';

  var votesArray = [];
  var viewsArray = [];
  for (i = 0; i < allItems.length; i++){
    votesArray.push(allItems[i].votes);
    viewsArray.push(allItems[i].views);
  }
  //code from Chart.js
  var ctx = document.getElementById('myChart').getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'bar',
      
    data: {
      labels: itemsNames,
      datasets: [{
        label: '# of Votes',
        data: votesArray,
        backgroundColor:'rgba(255, 99, 132, 0.4)',
          
        borderColor:'rgba(255, 99, 132, 1)',
          
        borderWidth: 1
      },
      {
        label: '# of Views',
        data: viewsArray,
        backgroundColor:'rgba(105, 99, 132, 0.6)',
          
        borderColor:'rgba(105, 99, 132, 1)',
          
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
  myChart.canvas.parentNode.style.width = '1120px';
}

//check if there is anything with the key "items" in the local storage
var storageItems = localStorage.getItem('items');
var storageVotesLeft = localStorage.getItem('votesLeft');
if (storageItems !== null){
  var returnedItems = JSON.parse(storageItems);
  allItems = returnedItems; //replacing allItems values with the new info from local storage so we could use it
}
if ((storageVotesLeft !== null) && (storageVotesLeft !== 0)){
  var returnedVotesLeft = JSON.parse(storageVotesLeft);
  votesLeft = returnedVotesLeft; //replacing votesLeft values with the new info from local storage so we could use it
  alertUser.textContent = `Welcome back! Please select one item that you mostlikely buy. You have ${votesLeft} votes.`;
}
function handleRedoTest (){
  document.location.reload();
} 

function handleClick(){
  if((item1El.lastChild.checked !== true) & (item2El.lastChild.checked !== true)&(item3El.lastChild.checked !== true)){ //checks if user choose one item before click submit button
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
    //delete 'votesLeft' from the local storage so the number of votes won't become negative
    localStorage.removeItem('votesLeft');
    
    //change the submitButton to "repeat Survey" and add eventlistener
    submitButton.value = 'Repeat Survey';
    submitButton.addEventListener('click', handleRedoTest);
  }  

  //clears check marks in radio buttons
  item1El.lastChild.checked = item2El.lastChild.checked = item3El.lastChild.checked = '';
  render();

  //clears old info from the local storage so we want get double info
  localStorage.removeItem('items');
  //adds a renewed allItems array in local storage
  var stringAllItems = JSON.stringify(allItems);
  localStorage.setItem('items', stringAllItems);
}
submitButton.addEventListener('click', handleClick);

render();


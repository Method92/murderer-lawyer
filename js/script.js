let players = [];
let outlierIndex = -1;
let currentPlayerIndex = -1; 
let currentPlayer = "";
let roundCount = 0; 
let isRoundLimit = false;
let playerVotes = [0, 0, 0, 0, 0, 0, 0, 0];
let votedIndex = 0;
let word = "";
let words = [
  "raspberries",
  "catfish",
  "apples",
  "raisins",
  "five-spice powder",
  "soybeans",
  "lemon juice",
  "Mandarin oranges",
  "vegemite",
  "cranberries",
  "cornstarch",
  "cupcakes", 
  "macaroni",
  "lentils",
  "mint",
  "vinegar",
  "flax seed",
  "peanut butter",
  "lima beans",
  "bouillon",
  "potato chips",
  "breadcrumbs",
  "sausages",
  "cauliflower",
  "salt",
  "broccoli",
  "spearmint",
  "grapes",
  "Parmesan",
  "clams",
  "sweet chili sauce",
  "broth",
  "cabbage",
  "grapefruits",
  "parsley",
  "moo shu wrappers",
  "peaches",
  "white beans",
  "tea",
  "sardines",
  "octopus", 
  "chocolate", 
  "snails", 
  "chili sauce", 
  "tabasco", 
  "alligator", 
  "gelatin", 
]; 
let questions = [
"Have you eaten this before?", 
"How much of this do you think you can eat?", 
"How much of this could you carry with both arms?", 
"Someone offers you one wish but you can only eat this food for the rest of your life, do you accept?",
"Where do you think this food is most popular?", 
"Would you eat this with ice cream?", 
"Do you think you should cook this?", 
"Where is this on a list of your 50 favourite foods?",
"A local ice cream place started serving an ice cream version of this. How popular will it be?", 
"How much do you think is the most that someone has paid for this?", 
"Would you feed this to your pet?", 
"If it could walk, would you keep it as a pet?",
"Do you think this would stain your clothes?", 
"How tall do you think you could make a tower of this food?", 
"Do you think children would enjoy this?", 
"Would you jump into a pool of this?", 
"Is it a surprise if nobody has tried it?", 
"How long do you think you would survive with only this to eat?",
"How good will this be in a food fight?", 
"How would you do in an eating competition with this?", 
"How likely are you eat this after dropping it on the floor?", 
"What's your favourite thing about this?",
"Could this food be served at a world class restaurant?"
];

$(document).ready(function () {
  //Starting screen 
  $('#playerCountInput').on("change", showPlayerCount);
  $('#playerCountButton').on("click", function(){
    loadNameInput();
    $('#playerCountSection').hide();
    $('#playerNamingSection').show();
    word = words[Math.floor(Math.random() * questions.length)]
  });
  //Saving names, determining roles and welcoming players. 
  $('#playerNamingButton').on("click", function () {
    if(validNameInput()){
      processNames(players);
      outlierIndex= determineRoles(players);
      welcomePlayers(players);
      roundLimit = players.length * 2;
      $('#playerNamingSection').hide();
      $('#welcomeSection').show();
    }
    else{
      $('.outputArea').html("Please enter a valid name");
    }
  });
  //Determining next player, asking for ready check. 
  $('.continueRoleButton').on("click", function () {
    $('#welcomeSection').hide(); 
    $('#roleSection').show();
    $('.continueRoleButton').html("OK");
    $('.outputArea').html("");
    determinePlayer(currentPlayer);
    roleReadyCheck();
  }); 
  //Showing role to player.
  $('#revealRoleButton').on("click", function () {
    showRole(words);
  });
  //Determining who is next, 
  $('.continueQuestionButton').on("click", function(){
    determinePlayer();
    if(isRoundLimit === false){
      questionReadyCheck();
      $('#roleSection').hide();
      $('#questionSection').show();
      $('#questionButton').show();
      $('.questionHeader').hide()
    } else{
      $('#votingButton').show();
    }
  });
  //Question players in turns. Increment round count
  $('#questionButton').on("click", function(){
    roundCount++;
    if(roundCount > (players.length) * 2){
      isRoundLimit = true;
    }
    askQuestion(isRoundLimit, questions);
  });
  $('#votingButton').on('click', function(){
    setupVoting();
  });
  //Voting section
  var totalVotes=0;
  $('#castVote0').on("click", function(){
    totalVotes = handleVoting(0, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote1').on("click", function(){
    totalVotes = handleVoting(1, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote2').on("click", function(){
    totalVotes = handleVoting(2, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote3').on("click", function(){
    totalVotes = handleVoting(3, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });  
  $('#castVote4').on("click", function(){
    totalVotes = handleVoting(4, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote5').on("click", function(){
    totalVotes = handleVoting(5, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote6').on("click", function(){
    totalVotes = handleVoting(6, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  $('#castVote7').on("click", function(){
    totalVotes = handleVoting(7, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });  
  $('#castVote8').on("click", function(){
    totalVotes = handleVoting(8, totalVotes, players);
    determinePlayer(currentPlayer);
    setupVoting();
  });
  //End reveal
  $('#endButton').on("click", function(){
    if(outlierIndex === votedIndex){
      $('#endArea').append("<br>Congratulations! You were right! The Outlier was <span class='emphasis'>" + players[outlierIndex] + "</span>");
    } else{ 
      $('#endArea').append("<br>Unlucky! You were wrong! The Outlier was <span class='emphasis'>" + players[outlierIndex] + "</span>");
    }
    for(var i = 0; i< playerVotes.length; i++){
      if(playerVotes[i]===playerVotes[votedIndex] && i != votedIndex){
        $('#endArea').html("It was a tie! The Outlier wins!")
      }
    }
    $('#endButton').hide(); 
    $('#resetButton').show(); 
  });
});
// *************** functions *******************

function setupVoting(){
  var buttonString = "";
    $('#votingHeader').html("<span class='emphasis'>" + currentPlayer + "</span> who you think is the outlier?");
    for(var i = 0; i < players.length; i++){
      if(currentPlayer != players[i]){
        $('#castVote'+i).css({"display":"block"});
        $('#castVote'+i).html(players[i]);
      } 
      else if(currentPlayer === players[i]){
        $('#castVote'+i).hide();
      }
    }
    $('#votingArea').html(buttonString);
    $('#votingButton').hide();

}
function handleVoting(buttonNumber, totalVotes, players){
  totalVotes = totalVotes+1;
  playerVotes[buttonNumber]++;
  if(totalVotes >= players.length){
    votedIndex = playerVotes.indexOf(Math.max.apply(Math, playerVotes));
    for(let i = 0; i< players.length; i++){
      $('#castVote'+i).hide();
    }
    $('#votingSection').hide();
    $('#endArea').html("The player voted was <span class='emphasis'><br>" + players[votedIndex] + "</span><br>");
    $('#endSection').show();
  }
  return totalVotes;
}
//Shows the players how many players have been selected, shows hidden button to continue
function showPlayerCount() {
  playerCount = $('#playerCountInput').val();
  playerCount = document.getElementById("playerCountInput").value;
  $('#outputSection').html("You have selected " + playerCount + " players. Press 'Go!' to start");
  $('#playerCountButton').show();
}
//Determies how many input fields are required (based on player count), inserts as html to playerNamingArea
function loadNameInput() {
  $("#outputSection").html("Please ensure all names are entered and press 'start' when ready <br />  " + playerCount);
  let inputFieldString = "";
  for (let i = 0; i < playerCount; i++) {
    inputFieldString += "<input type=\"text\" class=\"nameInput\" id=\"player" + (i + 1) + "Name\" placeholder=\"Player " + (i + 1) + "'s name..\" />";
  }
  $('#playerNamingArea').html(inputFieldString);
}

function validNameInput(){
  var checkNames= [];
  for(var i = 0 ; i < playerCount; i++){
    var name = $('#player' + (i + 1) + 'Name').val();
    name = name.replace(/\s/g, ''); //removing empty spaces
    if(name === "" || checkNames.includes(name)){
      return false;
    } 
    else{ 
      checkNames.push(name);
    }
  } 
  return true;
}
//Saves user-supplied names into 'players' array
function processNames(arr) {
  for (let i = 0; i < playerCount; i++) {
    let playerName = $('#player' + (i + 1) + 'Name').val(); //temp player name as needed
    arr.push(playerName);
  }
}
//Generates two different random numbers based on the amount of players. 
//Return used to supply indexing of the outlier
function determineRoles(arr) {
  let randomNumber = Math.floor(Math.random() * arr.length);
  //while loop to ensure different random numbers
  return randomNumber;
}
//Welcomes players based on names supplied - initially used for testing purposes
function welcomePlayers() {
  let welcomeString = "";
  for (let i = 0; i < players.length; i++) {
    if (i === (players.length - 1)) {
      welcomeString += " and <span class='emphasis'>" + players[i] + "</span>";
    } else {
      welcomeString += "<span class='emphasis'>" + players[i] + "</span>, ";
    }
  }
  $('#welcomeArea').html(welcomeString);
  $('.outputArea').html("Press 'Start' to begin!");
  $('.continueRoleButton').show(); 
}
//Determines who is next in the player queue and asks them to click the button when ready
function determinePlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length; 
  currentPlayer = players[currentPlayerIndex]; 
}
//Ready screen for role revealing 
function roleReadyCheck(){
  $('#roleArea').html("<span class='emphasis'>" + currentPlayer + "</span>, it's your turn! Make sure only you can see the screen and press the button."); 
  $('.continueRoleButton').hide();
  $('#revealRoleButton').html("I'm " + currentPlayer);
  $('#revealRoleButton').show();
}
//Ready screen for question asking
function questionReadyCheck(){
  $('#questionHeader').html("Question Time");
  $('#questionArea').html("<span class='emphasis'>" + currentPlayer + "</span>, time for a question. Gain control and press the button."); 
  $('.continueQuestionButton').hide();
  $('#questionButton').html("I'm " + currentPlayer);
  $('#questionButton').show();
}
//Reveals whether player is the outlier, or a regular player
function showRole() {
  if(currentPlayerIndex === outlierIndex){
    $('#roleArea').html("You are <span class='emphasis'>The Outlier!</span> Pretend you know the word and avoid detection."); 
  } 
  else { 
    $('#roleArea').html("The food is <span class='emphasis'>" + word + "</span>"); 
  }
  $('#revealRoleButton').hide();
  if (currentPlayerIndex === (players.length-1)){
    $('.continueQuestionButton').show();
  } else { 
    $('.continueRoleButton').show();
  }
}
//Asks question --- *** need to create list of questions relevant to category - find out how to read from XML file ***
//Should read from XML file. 
function askQuestion(isRoundLimit, questions){
  let question = questions[Math.floor(Math.random() * questions.length)]
  let nextPlayer = players[(currentPlayerIndex + 1) % players.length]; 

  $('#questionHeader').html("<span class='emphasis'>" + currentPlayer + "</span> ask <span class='emphasis'>" + nextPlayer + "</span>");
  $('#roleSection').hide(); 
  $('#questionSection').show(); 
  $('#questionButton').hide();
  $('.continueQuestionButton').show()
  if(isRoundLimit == false){
    $('#questionArea').html(question);
  } else{
    $('.continueQuestionButton').html("Time to vote!");
    $('#questionSection').hide();
    $('#votingSection').show();
    $('#votingButton').show();
  }
}

function togglePopup(){
  $('.popupContent').toggle();
  console.log("clicked")
}
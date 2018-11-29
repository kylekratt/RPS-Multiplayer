var config = {
  apiKey: "AIzaSyDcyyrkMbj4iyHCYEknSz2g1lip1-xo4eQ",
  authDomain: "rock-paper-scissors-37332.firebaseapp.com",
  databaseURL: "https://rock-paper-scissors-37332.firebaseio.com",
  projectId: "rock-paper-scissors-37332",
  storageBucket: "",
  messagingSenderId: "495755726939"
};
firebase.initializeApp(config);
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var stringRef = database.ref("/string");
var p1 = false;
var p2 = false;
var p1ref, p2ref, player, con, pname;
var wins=0;
var ties=0;
var losses=0;

database.ref().on("value", function (snapshot) {
  //This sets the values for whether player 1 and player 2 are picked to false, to be disproved
  p1 = false;
  p2 = false;
  $("#p1choice,#p2choice").attr("disabled", false);
  $("#p1name,#p2name").text("");
  //This checks each currently connected user to see whether player 1 and player 2 are currently picked, and displays their information if they are.
  Object.keys(snapshot.val().connections).forEach(function (element) {
    var snapval = snapshot.val().connections[element];
    if (snapval.pchoice == "player1") {
      p1 = true;
      p1ref = snapval;
      $("#p1choice").attr("disabled", true);
      $("#p1name").text(p1ref.pname);
      $("#1wins").text(p1ref.wins);
      $("#1ties").text(p1ref.ties);
      $("#1losses").text(p1ref.losses);
    }
    if (snapval.pchoice == "player2") {
      p2 = true;
      p2ref = snapval;
      $("#p2choice").attr("disabled", true);
      $("#p2name").text(p2ref.pname);
      $("#2wins").text(p2ref.wins);
      $("#2ties").text(p2ref.ties);
      $("#2losses").text(p2ref.losses);
    }
  })
  //This displays the arena contents or hides them depending on whether both player slots are filled
  if (p1 && p2) {
    start();
  }
  else
    hold();
})
//This activates whenever a line is entered in the chatbox
stringRef.on("value", function(snapshot){
  //Only users who are logged in as a player or a spectator can see the chat
  //If they are, the string is appended to the chat history, along with the time that the string was written
  if (player!=null){
    var newDiv = $("<div>");
    newDiv.css({"margin": "5px"}).text(snapshot.val().str);
    var newSpan = $("<span>");
    newSpan.css({"float": "right"}).text(snapshot.val().time);
    newDiv.append(newSpan);
    $("#history").append(newDiv);
    $("#history").scrollTop($("#history").prop("scrollHeight"));
  }
})
//This keeps track of your current connection 
connectedRef.on("value", function (snap) {
  if (snap.val()) {
    con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});
//Once you login with a player selection and a name choice, your database information is updated
$("#submit").on("click", function (event) {
  event.preventDefault();
  if ($("#pchoice").val() == null)
    return
  player = $("#pchoice").val();
  pname = $("#pname").val();
  con.update({
    throw: false,
    pchoice: player,
    pname: pname,
    wins: wins,
    ties: ties,
    losses: losses
  })
})
//This allows you to throw rock paper or scissors
$(".hand").on("click", function(event){
  con.update({
    throw: true,
    throwType: $(this).attr("id")
  })
})
//This displays the arena when both player slots are taken. The rock paper scissors buttons are only displayed for the two players, not spectators.
function start() {
  $("#arena").css("visibility", "visible");
  if ((player != "player1") && (player != "player2")) {
    $(".hand").css("visibility", "hidden");
  }
  else
    $(".hand").css("visibility", "visible");
//This shows the outcome once both players have made a pick. It returns the throw value back to false so the game knows not to run this again until both players have picked again.
  if ((p1ref.throw==true)&&(p2ref.throw==true)){
    con.update({
      throw: false
    })
    combat();
  }
}
//This hides the arena shown by the start function, in the event that a player leaves.
function hold() {
  $("#arena,.hand").css("visibility", "hidden")
}
//This takes all the cases and displays the choice each player made in the arena
function combat(){
  $("#gameres").css("opacity", "0");
  if (p1ref.throwType=="rock"){
    $("#p1throwimg").attr("src", "assets/images/rock.png")
  }
  else if (p1ref.throwType=="paper"){
    $("#p1throwimg").attr("src", "assets/images/paper.png")
  }
  else if (p1ref.throwType=="scissors"){
    $("#p1throwimg").attr("src", "assets/images/scissors.png")
  }
  if (p2ref.throwType=="rock"){
    $("#p2throwimg").attr("src", "assets/images/rock.png")
  }
  else if (p2ref.throwType=="paper"){
    $("#p2throwimg").attr("src", "assets/images/paper.png")
  }
  else if (p2ref.throwType=="scissors"){
    $("#p2throwimg").attr("src", "assets/images/scissors.png")
  }
  //This animates those choices to make them look cooler
  $("#p1throw, #p2throw").css("opacity","1");
  $("#p1throw").animate({left: '100px'}, "fast");
  $("#p1throw").animate({left: '0px'}, "fast");
  $("#p1throw").animate({left: '30px'}, "slow");
  $("#p1throw").animate({opacity: "0"}, 500);
  $("#p2throw").animate({right: '100px'}, "fast");
  $("#p2throw").animate({right: '0px'}, "fast");
  $("#p2throw").animate({right: '30px'}, "slow");
  $("#p2throw").animate({opacity: "0"}, 500);
  //This takes all the cases for the possibility of a tie, win, or loss, updates their database reference, and displays the results in the gameres div.
  if ((p1ref.throwType=="rock")&&(p2ref.throwType=="rock")||(p1ref.throwType=="paper")&&(p2ref.throwType=="paper")||(p1ref.throwType=="scissors")&&(p2ref.throwType=="scissors")){
    if (player=="player1"){
      ties++;
      con.update({
        ties: ties
      })
    }
    if (player=="player2"){
      ties++;
      con.update({
        ties: ties
      })
    }
    $("#gameres").text("It's a tie!");
  }
  if ((p1ref.throwType=="rock")&&(p2ref.throwType=="scissors")||(p1ref.throwType=="paper")&&(p2ref.throwType=="rock")||(p1ref.throwType=="scissors")&&(p2ref.throwType=="paper")){
    if (player=="player1"){
      wins++;
      con.update({
        wins: wins
      })
    }
    if (player=="player2"){
      losses++;
      con.update({
        losses: losses
      })
    }
    $("#gameres").text("Player 1 Wins!");
  }
  if ((p1ref.throwType=="rock")&&(p2ref.throwType=="paper")||(p1ref.throwType=="paper")&&(p2ref.throwType=="scissors")||(p1ref.throwType=="scissors")&&(p2ref.throwType=="rock")){
    if (player=="player1"){
      losses++;
      con.update({
        losses: losses
      })
    }
    if (player=="player2"){
      wins++;
      con.update({
        wins: wins
      })
    }
    $("#gameres").text("Player 2 Wins!");
  }
  //This displays the results in a stylish fashion.
  setTimeout(function(){$("#gameres").animate({"opacity": "1"}, 1200)},800);
}
//This runs when the user presses enter in the chatbox
function upload(){
  if(event.key === 'Enter'){
    event.preventDefault();
    //This updates the latest input and the time it was put in. Only one string is in the database at a time because I'm cheap.
    if (player!=null){
      if ($("#textbox").val()==""){
        return;
      }
      var newStr = pname + ": " + $("#textbox").val();
      $("#textbox").val("");
      stringRef.update({
        str: newStr,
        time: (moment().format("DD-MM-YY HH:mm:ss"))
      })
    }
//This prevents users who aren't logged in from using the chatbox and shows them the error of their ways.
    else{
      var newDiv = $("<div>");
      newDiv.css({"margin": "5px"}).text("Please login before using the chat");
      $("#history").append(newDiv);
      $("#textbox").val("");
    }
  }
}
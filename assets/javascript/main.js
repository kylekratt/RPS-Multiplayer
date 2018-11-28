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
  p1 = false;
  p2 = false;
  $("#p1choice,#p2choice").attr("disabled", false);
  $("#p1name,#p2name").text("");
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
  database.ref().update({
    player1: p1,
    player2: p2
  })
  if (p1 && p2) {
    start();
  }
  else
    hold();
})
stringRef.on("value", function(snapshot){
  console.log("this ran");
  if (player!=null){
    console.log(snapshot.val().str);
    var newDiv = $("<div>");
    newDiv.css({"margin": "5px"}).text(snapshot.val().str);
    var newSpan = $("<span>");
    newSpan.css({"float": "right"}).text(snapshot.val().time);
    newDiv.append(newSpan);
    $("#history").append(newDiv);
  }
})
connectedRef.on("value", function (snap) {
  if (snap.val()) {
    con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});
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
    wins: 0,
    ties: 0,
    losses: 0
  })
})
$(".hand").on("click", function(event){
  con.update({
    throw: true,
    throwType: $(this).attr("id")
  })
})
function start() {
  $("#arena").css("visibility", "visible");
  if ((player != "player1") && (player != "player2")) {
    $(".hand").css("visibility", "hidden");
  }
  else
    $(".hand").css("visibility", "visible");
  if ((p1ref.throw==true)&&(p2ref.throw==true)){
    con.update({
      throw: false
    })
    combat();
  }
}
function hold() {
  $("#arena,.hand").css("visibility", "hidden")
}
function combat(){
  $("#gamesres").css("opacity", "0");
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
  $("#p1throw, #p2throw").css("opacity","1");
  $("#p1throw").animate({left: '100px'}, "fast");
  $("#p1throw").animate({left: '0px'}, "fast");
  $("#p1throw").animate({left: '30px'}, "slow");
  $("#p1throw").animate({opacity: "0"}, 500);
  $("#p2throw").animate({right: '100px'}, "fast");
  $("#p2throw").animate({right: '0px'}, "fast");
  $("#p2throw").animate({right: '30px'}, "slow");
  $("#p2throw").animate({opacity: "0"}, 500);
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
  setTimeout(function(){$("#gameres").animate({"opacity": "1"}, 1200)},800);
}
function upload(){
  if(event.key === 'Enter'){
    event.preventDefault();
    if (player!=null){
      var newStr = pname + ": " + $("#textbox").val();
      $("#textbox").val("");
      stringRef.update({
        str: newStr,
        time: (moment().format("DD-MM-YY HH:mm:ss"))
      })
    }
    else{
      var newDiv = $("<div>");
      newDiv.css({"margin": "5px"}).text("Please login before using the chat");
      $("#history").append(newDiv);
      $("#textbox").val("");
    }
  }
}
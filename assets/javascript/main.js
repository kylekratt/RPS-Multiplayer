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
var p1 = false;
var p2 = false;
var p1ref;
var p2ref;
var player;
var con;
database.ref().on("value", function(snapshot) {
  p1=false;
  p2=false;
  $("#p1choice,#p2choice").attr("disabled", false);
  $("#p1name,#p2name").text("");
  Object.keys(snapshot.val().connections).forEach(function(element){
    var snapval=snapshot.val().connections[element];
    if (snapval.pchoice=="player1"){
      p1 = true;
      p1ref=snapval;
      $("#p1choice").attr("disabled", true);
      $("#p1name").text(p1ref.pname);
    }
    if (snapval.pchoice=="player2"){
      p2 = true;
      p2ref=snapval;
      $("#p2choice").attr("disabled", true);
      $("#p2name").text(p2ref.pname);
    }
  })
  database.ref().update({
    player1: p1,
    player2: p2
  })
  if (p1&&p2)
    start();
  else
    hold();
})
connectedRef.on("value", function (snap) {
  if (snap.val()) {
    con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});
$("#submit").on("click", function (event) {
  event.preventDefault();
  player = $("#pchoice").val();
  var pname = $("#pname").val();
  if (player=="player1"){
    
  }
  else if (player=="player2"){
    $("#p2name").text(pname);
  }
  con.update({
    pchoice: player,
    pname: pname
  })
})
function start(){
  $("#arena").attr("visibility", "visible")
}
function hold(){
  $("#arena").attr("visibility", "hidden")
}
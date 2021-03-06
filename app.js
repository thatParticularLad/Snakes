var express = require("express");
var http = require("http");
var websocket = require("ws");

var messages = require("./public/javascripts/messages");
var Game = require("./game");
var gameStatus = require("./statusTracker");

var port = process.argv[2];
var app = express();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"));

//HTML routes
app.get("/splash", function(req, res){
  res.sendFile("splash.html", {root: "./public"});
});

app.get("/start", function(req, res){
  res.sendFile("game.html", {root: "./public"});
});


app.get('/', (req, res) => {
    //here gameStatus is an object holding this information
    //res.cookie("mycookie",1,{httpOnly:false});
    res.render('splash.ejs', { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted,  numberofPlayers: gameStatus.numberofPlayers });

})

//


var server = http.createServer(app); //server
const wss = new websocket.Server({ server }); //creating a socket

var websockets = {};//property: websocket, value: game

/*
 * regularly clean up the websockets object
 */ 
setInterval(function() {
  for(let i in websockets){
      if(websockets.hasOwnProperty(i)){
          let gameObj = websockets[i];
          //if the gameObj has a final status, the game is complete/aborted
          if(gameObj.finalStatus!=null){
              console.log("\tDeleting element "+i);
              delete websockets[i];
          }
      }
  }
}, 50000);


var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;//each websocket receives a unique ID

wss.on("connection", function(ws) {

    let con = ws; 
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log("Player %s placed in game %s as %s", con.id, currentGame.id, playerType);
    gameStatus.numberofPlayers++;
    /*
     * inform the client about its assigned player type
     */ 
    con.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);
    
  
    /*
     * once we have two players, there is no way back; 
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */ 
    if (currentGame.hasTwoConnectedPlayers()) {
      currentGame = new Game(gameStatus.gamesInitialized++);
    }

  /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP 
     */ 
    con.on("message", function incoming(message) {

      let oMsg = JSON.parse(message);

      let gameObj = websockets[con.id];
      let isPlayerA = (gameObj.playerA == con) ? true : false;
       
        
      if (isPlayerA) { 
        
          /*
           * player A can make a move; 
           * which is forwarded to B
           */ 
        if(oMsg.type == messages.T_A_MOVE){
           
            if(gameObj.hasTwoConnectedPlayers()){
              
              gameObj.playerB.send(message);
              gameObj.setStatus("A MOVE");
            }
        }

        /*
         * player A can state who won/lost
         */ 
        if( oMsg.type == messages.T_GAME_WON_BY){
            gameObj.setStatus(oMsg.data);
            gameObj.playerB.send(message)
            //game was won by somebody, update statistics
            gameStatus.gamesCompleted++;
        }            
      }
      else {
        
        if(oMsg.type == messages.T_B_READY){
              
            gameObj.playerA.send(message);
            //gameObj.setStatus("B MOVE");
        }
                     
          /*
           * player B can make a move 
           * which  is forwarded to A
           */ 
          if(oMsg.type == messages.T_B_MOVE){
              
              gameObj.playerA.send(message);
              gameObj.setStatus("B MOVE");
          }

          /*
           * player B can state who won/lost
           */ 
          if( oMsg.type == messages.T_GAME_WON_BY){
              gameObj.setStatus(oMsg.data);
              gameObj.playerA.send(message);
              //game was won by somebody, update statistics
              gameStatus.gamesCompleted++;
          }            
      }
  });




    con.on("close", function (code) {
        
        /*
        * code 1001 means almost always closing initiated by the client;
        * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
        */
        console.log(con.id + " disconnected ...");

        if (code == "1001") {
            /*
            * if possible, abort the game; if not, the game is already completed
            */
            let gameObj = websockets[con.id];
            if (gameObj.isValidTransition(gameObj.gameState, "0 JOINT")) {
                currentGame.removePlayer();
                gameStatus.numberofPlayers--;
                console.log("Player A left before connecting to player B");
                gameObj.setStatus("0 JOINT");
            }

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED"); 
                gameStatus.gamesAborted++;
                gameStatus.numberofPlayers--;
                gameStatus.numberofPlayers--;

                /*
                * determine whose connection remains open;
                * close it
                */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                }
                catch(e){
                    console.log("Player A closing: "+ e);
                }

                try {
                    gameObj.playerB.close(); 
                    gameObj.playerB = null;
                }
                catch(e){
                    console.log("Player B closing: " + e);
                }                
            }
            
        }
    });


  


});

server.listen(port);
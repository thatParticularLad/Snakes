function StatusBar(){
    this.setStatus = function(status){
        document.getElementById("statusbar").innerHTML = status;
    };
}
function occupy1(move){
    var square = document.getElementById('s'+move); 
    square.classList.add("occupied1"); //give a class to the square on which the hat should be
} 
function occupy2(move){
    var square = document.getElementById('s'+move); 
    square.classList.add("occupied2"); //give a class to the square on which the hat should be 
} 
function deoccupy1(move){
    var square = document.getElementById('s'+move);
    square.classList.remove("occupied1"); //remove the hat from the square 
} 
function deoccupy2(move){
    var square = document.getElementById('s'+move);
    square.classList.remove("occupied2"); //remove the hat from the square 
} 

function snakes(position){ //snake squares
    if(position == 11)
        position = 6;
    else if(position == 38)
        position = 13;
    else if(position == 55)
        position = 40;
    else if(position == 62)
        position = 18;
    return position;
}

function ladders(position){ //ladder squares
    if(position == 5)
        position = 10;
    else if(position == 15)
        position = 30;
    else if(position == 22)
        position = 60;
    else if(position == 35)
        position = 50;
    return position;
}

/* basic constructor of game state */
function GameState(socket, sb){

    this.playerType = null;
   
   this.statusBar = sb; //sita reikia padaryti butinai
   this.currentBlock1 = 1; //PlayerA pozicija
   this.currentBlock2 = 1; //Player B pozicija
   this.rollednum = 0;

   this.getRollednum = function(){
       return this.rollednum;
   };

   this.setRollednum = function(p){
       this.rollednum = p;
    };


    this.getPlayerType = function () { // player A or player B?
        return this.playerType;
    };

    this.setPlayerType = function (p) {
        this.playerType = p;
    };

    this.getCurrentBlock1 = function () {
       return this.currentBlock1
    };

    this.getCurrentBlock2 = function () {
        return this.currentBlock2
    };

    this.setCurrentBlock1 = function (p) {
        this.currentBlock1 = p;
    };

    this.setCurrentBlock2 = function (p) {
        this.currentBlock2 = p;
    };

    this.whoWon = function(){ 
        //Player A reached the end first
        if( this.currentBlock1>63){
            return "A";
        }
        // Player B  reached the end first 
        if( this.currentBlock2>63){
            return "B";
        }
        return null; //nobody won yet
    };
   

    this.updateGame = function(oldmove, move){
        //console.assert(typeof move == "integer", "%i: Expecting a string, got a %i", arguments.callee.name, typeof move);
        if(this.playerType == "A"){
                    
            deoccupy2(oldmove);            
            this.setCurrentBlock2(move); //add the rolled number to the current position
            this.setCurrentBlock2(snakes(move)); //cheking if the hat stepped on the snake
            this.setCurrentBlock2(ladders(move)); ///cheking if the hat stepped on the ladder
            occupy2(move); 
            if(move == this.currentBlock1){
                deoccupy1(this.currentBlock1);
                this.setCurrentBlock1(1);
                occupy1(1);                
            }

        }
        if(this.playerType == "B"){
                   
            deoccupy1(oldmove);
            this.setCurrentBlock1(move); //add the rolled number to the current position
            this.setCurrentBlock1(snakes(move)); //cheking if the hat stepped on the snake
            this.setCurrentBlock1(ladders(move)); ///cheking if the hat stepped on the ladder
            occupy1(move);
            if(move == this.currentBlock2){
                deoccupy2(this.currentBlock2);
                this.setCurrentBlock2(1);
                occupy2(1);                
            }
        }


        //is the game complete?
        let winner = this.whoWon();

        if(winner != null){
               
            let alertString;
            if( winner == this.playerType){
                alertString = Status["gameWon"];
            }
            else {
                alertString = Status["gameLost"];
            }
            alertString += Status["playAgain"];
            sb.setStatus(alertString);

            //player B sends final message
            if(this.playerType == "B"){
                let finalMsg = Messages.O_GAME_WON_BY;
                finalMsg.data = winner;
                socket.send(JSON.stringify(finalMsg));
            }
            if(this.playerType == "A"){
                let finalMsg = Messages.O_GAME_WON_BY;
                finalMsg.data = winner;
                socket.send(JSON.stringify(finalMsg));
            }
            socket.close();
        }    

    };
}


(function setup(){
    var socket = new WebSocket("ws://localhost:3000");

    /*
     * initialize all UI elements of the game:
     * - visible word board (i.e. place where the hidden/unhidden word is shown)
     * - status bar
     * - alphabet board
     * 
     * the GameState object coordinates everything
     */ 
    

    //no object, just a function
  
    var sb = new StatusBar();
    var gs = new GameState(socket, sb);
         

    socket.onmessage = function (event) {

        let incomingMsg = JSON.parse(event.data);
        console.log(incomingMsg);
 
        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            
            gs.setPlayerType( incomingMsg.data );//should be "A" or "B"

            //if player type is A, (1) pick a word, and (2) sent it to the server
            if (gs.getPlayerType() == "A") {               

                //reikia leisti paspausti mygtuka, po paspaudimo nebeleisti spausti ir laukti

                //sb.setStatus(Status["player1Intro"]); 
                //ab.initialize();  
                function rollDice(callback){
                    const button = document.getElementById('button');
                    button.addEventListener('click', function singleclick(e) {
                        console.log('button was clicked');
                        var rolled = Math.floor((Math.random() * 6) + 1); // randomly generated number from one to six
                        window.alert(rolled); // displays the rolled number in an alert
                        gs.setRollednum(rolled); 
                        console.log(gs.getRollednum());

                        callback();
                        button.removeEventListener('click', singleclick, false);   
                    }); 
                                     
                } 

                function moveRolled(){          
                    gs.setCurrentBlock1(gs.getCurrentBlock1() + gs.getRollednum()); //add the rolled number to the current position
                    gs.setCurrentBlock1(snakes(gs.getCurrentBlock1())); //checking if the hat stepped on the snake
                    gs.setCurrentBlock1(ladders(gs.getCurrentBlock1())); ///checking if the hat stepped on the ladder
                    occupy1(gs.getCurrentBlock1());

                    console.log(gs.getCurrentBlock1()); //testuoju

                    let outgoingMsg = Messages.O_A_MOVE;
                    outgoingMsg.data = gs.getCurrentBlock1();
                    socket.send(JSON.stringify(outgoingMsg));
                    console.log(outgoingMsg);

                }              
                //let res = null;
                
               // sb.setStatus(Status["chosen"]+res);  
                rollDice(moveRolled);               
    
            }
            else {
                //sb.setStatus(Status["player2IntroNoTargetYet"]);   
            }
        }

        //Player B: wait for the made move and then start guessing ...
        if( incomingMsg.type == Messages.T_A_MOVE && gs.getPlayerType() == "B"){
            console.log(incomingMsg.data); 
            gs.updateGame(gs.getCurrentBlock1(), incomingMsg.data);

            function rollDice(callback){
                const button = document.getElementById('button');
                button.addEventListener('click', function singleclick(e) { 
                    console.log('button was clicked');
                    var rolled = Math.floor((Math.random() * 6) + 1); // randomly generated number from one to six
                    window.alert(rolled); // displays the rolled number in an alert
                    gs.setRollednum(rolled); 
                    console.log(gs.getRollednum());

                    callback();
                    button.removeEventListener('click', singleclick, false);  
                });                     
            } 

            function moveFigure(){
                deoccupy2(gs.getCurrentBlock2());
                gs.setCurrentBlock2(gs.getCurrentBlock2() + gs.getRollednum()); //add the rolled number to the current position
                gs.setCurrentBlock2(snakes(gs.getCurrentBlock2())); //cheking if the hat stepped on the snake
                gs.setCurrentBlock2(ladders(gs.getCurrentBlock2())); ///cheking if the hat stepped on the ladder
                occupy2(gs.getCurrentBlock2()); 

                console.log(gs.getCurrentBlock2());
                
                let outgoingMsg = Messages.O_B_MOVE;
                outgoingMsg.data = gs.getCurrentBlock2();
                socket.send(JSON.stringify(outgoingMsg));
                }
            rollDice(moveFigure);
               
        }

        //Player A receives B players move and starts to move
        if( incomingMsg.type == Messages.T_B_MOVE && gs.getPlayerType()=="A"){
            console.log(incomingMsg.data);
            console.log(gs.getCurrentBlock2());
            gs.updateGame(gs.getCurrentBlock2(), incomingMsg.data);
                       
            function rollDice(callback){
                const button = document.getElementById('button');
                button.addEventListener('click', function singleclick(e) { 
                    console.log('button was clicked');
                    var rolled = Math.floor((Math.random() * 6) + 1); // randomly generated number from one to six
                    window.alert(rolled); // displays the rolled number in an alert
                    gs.setRollednum(rolled); 
                    console.log(gs.getRollednum());

                    callback();
                    button.removeEventListener('click', singleclick, false);  
                });                     
            } 
            function moveFigure(){
                deoccupy1(gs.getCurrentBlock1()); 
                gs.setCurrentBlock1(gs.getCurrentBlock1() + gs.getRollednum()); //add the rolled number to the current position
                gs.setCurrentBlock1(snakes(gs.getCurrentBlock1())); //cheking if the hat stepped on the snake
                gs.setCurrentBlock1(ladders(gs.getCurrentBlock1())); ///cheking if the hat stepped on the ladder
                occupy1(gs.getCurrentBlock1()); 

                let outgoingMsg = Messages.O_A_MOVE;
                outgoingMsg.data = gs.getCurrentBlock1();
                console.log(JSON.stringify(outgoingMsg));
                socket.send(JSON.stringify(outgoingMsg));
                console.log(outgoingMsg);
            }  

            rollDice(moveFigure);
        }
     
    };

    socket.onopen = function(){
        socket.send("{}");
    };
    
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function(){
        if(gs.whoWon()==null){
            //sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function(){  
    };
})(); //execute immediately

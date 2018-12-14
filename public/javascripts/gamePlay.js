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
        if(p<64)
            this.currentBlock1 = p;
        else
            this.currentBlock1 = 64;
    };

    this.setCurrentBlock2 = function (p) {
        if(p<64)
            this.currentBlock2 = p;
        else
            this.currentBlock2 = 64;
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

    this.roll = function(){
        var rolled = Math.floor((Math.random() * 6) + 1); // randomly generated number from one to six
        window.alert(rolled); // displays the rolled number in an alert
        this.setRollednum(rolled);
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

            //if player type is A, (1) wait for B
            if (gs.getPlayerType() == "A") {               

                sb.setStatus(Status["playerWaitingB"]);  
            }
            //if player type B, send READY message and wait for A to move
            else {
                sb.setStatus(Status["playerWaiting"]);  
                let outgoingMsg = Messages.O_B_READY;
                socket.send(JSON.stringify(outgoingMsg)); 
            }
        }

        if( incomingMsg.type == Messages.T_B_READY && gs.getPlayerType() == "A"){
            sb.setStatus(Status["playerIntro"]);  
            function rollDice(callback){
                const button = document.getElementById('button');
                button.classList.add("diceActive");                   
                button.addEventListener('click', function singleclick(e) {
                    console.log('button was clicked');
                    
                    gs.roll();
                    callback();
                    button.removeEventListener('click', singleclick, false);
                    button.classList.remove("diceActive");
                    sb.setStatus(Status["playerWaiting"]);   
                }); 
                                 
            } 

            function moveRolled(){          
                gs.setCurrentBlock1(gs.getCurrentBlock1() + gs.getRollednum()); //add the rolled number to the current position
                gs.setCurrentBlock1(snakes(gs.getCurrentBlock1())); //checking if the hat stepped on the snake
                gs.setCurrentBlock1(ladders(gs.getCurrentBlock1())); ///checking if the hat stepped on the ladder
                occupy1(gs.getCurrentBlock1());
           
                let outgoingMsg = Messages.O_A_MOVE;
                outgoingMsg.data = gs.getCurrentBlock1();
                socket.send(JSON.stringify(outgoingMsg));
                console.log(outgoingMsg);

            }              
            
            rollDice(moveRolled);               

        }

        //Player B: wait for the made move and then start guessing ...
        if( incomingMsg.type == Messages.T_A_MOVE && gs.getPlayerType() == "B"){
            console.log(incomingMsg.data); 
            sb.setStatus(Status["move"] + incomingMsg.data);
            gs.updateGame(gs.getCurrentBlock1(), incomingMsg.data);

            sb.setStatus(Status["playerIntro"]);

            function rollDice(callback){
                const button = document.getElementById('button');
                button.classList.add("diceActive");
                button.disabled = false;
                button.addEventListener('click', function singleclick(e) { 
                    console.log('button was clicked');
                    gs.roll();
                   
                    callback();
                    button.removeEventListener('click', singleclick, false);
                    button.classList.remove("diceActive");
                    
                });                     
            } 

            function moveFigure(){
                deoccupy2(gs.getCurrentBlock2());
                gs.setCurrentBlock2(gs.getCurrentBlock2() + gs.getRollednum()); //add the rolled number to the current position
                gs.setCurrentBlock2(snakes(gs.getCurrentBlock2())); //cheking if the hat stepped on the snake
                gs.setCurrentBlock2(ladders(gs.getCurrentBlock2())); ///cheking if the hat stepped on the ladder
                occupy2(gs.getCurrentBlock2()); 

                if(gs.getCurrentBlock1() == gs.getCurrentBlock2()){
                    deoccupy1(gs.getCurrentBlock1());
                    gs.setCurrentBlock1(1);
                    occupy1(1);
                }

                
                 if(gs.whoWon()==null){               
                    let outgoingMsg = Messages.O_B_MOVE;
                    outgoingMsg.data = gs.getCurrentBlock2();
                    socket.send(JSON.stringify(outgoingMsg));

                    sb.setStatus(Status["playerWaiting"]); 
                }
                else{
                    let finalMsg = Messages.O_GAME_WON_BY;
                    finalMsg.data = gs.whoWon();
                    socket.send(JSON.stringify(finalMsg));
                    sb.setStatus(Status["gameWon"]+Status["playAgain"]);
                }
            }
            rollDice(moveFigure);
               
        }

        //Player A receives B players move and starts to move
        if( incomingMsg.type == Messages.T_B_MOVE && gs.getPlayerType()=="A"){
            console.log(incomingMsg.data);
            sb.setStatus(Status["move"] + incomingMsg.data);
            gs.updateGame(gs.getCurrentBlock2(), incomingMsg.data);

            sb.setStatus(Status["playerIntro"]);          
            function rollDice(callback){
                const button = document.getElementById('button');
                button.classList.add("diceActive");
                button.disabled = false;
                button.addEventListener('click', function singleclick(e) { 
                    console.log('button was clicked');
                    gs.roll();                   

                    callback();
                    button.removeEventListener('click', singleclick, false);
                    button.classList.remove("diceActive");
                });                     
            } 
            function moveFigure(){
                deoccupy1(gs.getCurrentBlock1()); 
                gs.setCurrentBlock1(gs.getCurrentBlock1() + gs.getRollednum()); //add the rolled number to the current position
                gs.setCurrentBlock1(snakes(gs.getCurrentBlock1())); //cheking if the hat stepped on the snake
                gs.setCurrentBlock1(ladders(gs.getCurrentBlock1())); ///cheking if the hat stepped on the ladder
                occupy1(gs.getCurrentBlock1()); 

                if(gs.getCurrentBlock1() == gs.getCurrentBlock2()){
                    deoccupy2(gs.getCurrentBlock2());
                    gs.setCurrentBlock2(1);
                    occupy2(1);
                }
                if(gs.whoWon() == null){
                    let outgoingMsg = Messages.O_A_MOVE;
                    outgoingMsg.data = gs.getCurrentBlock1();
                    
                    socket.send(JSON.stringify(outgoingMsg));
                    console.log(outgoingMsg);
                    sb.setStatus(Status["playerWaiting"]); 
                }
                else {
                    sb.setStatus(Status["gameWon"]+Status["playAgain"]);  
                    let finalMsg = Messages.O_GAME_WON_BY;
                    finalMsg.data = gs.whoWon();
                    socket.send(JSON.stringify(finalMsg));
                }
            }  

            rollDice(moveFigure);
        }

        if( incomingMsg.type == Messages.T_GAME_WON_BY && gs.getPlayerType()=="B"){
            deoccupy1(gs.getCurrentBlock1());
            gs.setCurrentBlock1(64);
            occupy1(64);

            sb.setStatus(Status["gameLost"]+Status["playAgain"]); 
            socket.close();
        }

        if( incomingMsg.type == Messages.T_GAME_WON_BY && gs.getPlayerType()=="A"){
            deoccupy2(gs.getCurrentBlock2());
            gs.setCurrentBlock2(64);
            occupy2(64);

            sb.setStatus(Status["gameLost"]+Status["playAgain"]); 
            socket.close();
        }
     
    };

    socket.onopen = function(){
        socket.send("{}");
    };
    
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function(){
        if(gs.whoWon()==null){
            sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function(){  
    };
})(); //execute immediately

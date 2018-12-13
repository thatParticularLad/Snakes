(function(exports){

    /* 
     * Client to server: game is complete, the winner is ... 
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";             
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };

    /*
     * Server to client: abort game (e.g. if second player exited the game) 
     */
    exports.O_GAME_ABORTED = {                          
        type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: set as player A 
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {                            
        type: exports.T_PLAYER_TYPE,
        data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    /* 
     * Server to client: set as player B 
     */
    exports.O_PLAYER_B = {                            
        type: exports.T_PLAYER_TYPE,
        data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);


    /* 
     * Player A to server OR server to Player B: this is the opponents move
     */
    exports.T_A_MOVE = "A-MOVE";
    exports.O_A_MOVE = {                         
        type: exports.T_A_MOVE,
        data: null,
       
    };
    

    /* 
     * Player B to server OR server to Player A: this is the opponents move
     */
    exports.T_B_MOVE = "B-MOVE";         
    exports.O_B_MOVE = {
        type: exports.T_B_MOVE,
        data: null,
     
    };
   

    /* 
     * Server to Player A & B: game over with result won/loss 
     */
    exports.T_GAME_OVER = "GAME-OVER";              
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null
    };


}(typeof exports === "undefined" ? this.Messages = {} : exports));
//if exports is undefined, we are on the client; else the server
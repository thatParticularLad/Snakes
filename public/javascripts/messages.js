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
     * Server to client: Roll dice
     */
    exports.O_ROLL = { type: "ROLL-DICE" };
    exports.S_ROLL = JSON.stringify(exports.O_ROLL);


    /* 
     * Player A to server OR server to Player B: this is the opponents move
     */
    exports.T_A_MOVE = "ROLLED-SQUARE";
    exports.O_A_MOVE = {                         
        type: exports.T_A_MOVE,
        data: null
    };
    

    /* 
     * Player B to server OR server to Player A: this is the opponents move
     */
    exports.T_B_MOVE = "ROLLED_SQUARE";         
    exports.O_B_MOVE = {
        type: exports.T_A_MOVE,
        data: null
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
var currentBlock1= 1; //the square on which the hat is currently on
var currentBlock2= 1;
var player = true;

function occupy1(){
    var square = document.getElementById('s'+currentBlock1); 
    square.classList.add("occupied1"); //give a class to the square on which the hat should be
} 
function occupy2(){
    var square = document.getElementById('s'+currentBlock2); 
    square.classList.add("occupied2"); //give a class to the square on which the hat should be 
} 
function deoccupy1(){
    var square = document.getElementById('s'+currentBlock1);
    square.classList.remove("occupied1"); //remove the hat from the square 
} 
function deoccupy2(){
    var square = document.getElementById('s'+currentBlock2);
    square.classList.remove("occupied2"); //remove the hat from the square 
} 


function rollNum(){
    var rolled = Math.floor((Math.random() * 6) + 1); // randomly generated number from one to six
    window.alert(rolled); // displays the rolled number in a alert
    return rolled; 
}

function moveFigure(){
    var r = rollNum(); 
    if(player == true){ //player one movements
        deoccupy1(); 
        currentBlock1+=r; //add the rolled number to the current position
        currentBlock1 = snakes(currentBlock1); //cheking if the hat stepped on the snake
        currentBlock1 = ladders(currentBlock1); ///cheking if the hat stepped on the ladder
        if(currentBlock1< 64){
            if(currentBlock1 == currentBlock2){ //if the player occupies a square already occupied by another player
                deoccupy2(); // another player is sent back to the start
                currentBlock2= 1;
                occupy2();
            }
            occupy1(); 
            player = false;
        }
        else{ //winning condition
            currentBlock1=64;
            occupy1();
            window.alert("Congratulations palyer1, you won!");
            deoccupy2(); 
            deoccupy1(); 
            currentBlock1=1;
            currentBlock2=1;
        }
    }

    else{ // player two movements
        deoccupy2(); 
        currentBlock2+=r; //add the rolled number to the current position
        currentBlock2 = snakes(currentBlock2); //cheking if the hat stepped on the snake
        currentBlock2 = ladders(currentBlock2); ///cheking if the hat stepped on the ladder
        if(currentBlock2 < 64){
            if(currentBlock2 == currentBlock1){ //if the player occupies a square already occupied by another player
                deoccupy1(); // another player is sent back to the start
                currentBlock1 = 1;
                occupy1();
            }
            occupy2(); 
            player = true;
        }
        else{ //winning condition
            currentBlock2=64;
            occupy2();
            window.alert("Congratulations player2, you won!");
            deoccupy2(); 
            deoccupy1(); 
            currentBlock1=1;
            currentBlock2=1;
        }
    }
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
//Roll num prid

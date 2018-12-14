//Creating a board

var i = 1; //identification number for rows
var sqrn = 64; // identification number for squares
	for(x=0; x<8; x++){ // creating 8 rows of the board
		var rw = document.createElement('div');
		
		rw.className = "row";
		rw.id = "r"+i;

		document.getElementById('board').appendChild(rw);			
			
		for(y=0; y<8;y++) { // creating 8 squares in each row
			var sqr = document.createElement('div');
			sqr.className = "square";
			sqr.id = 's' + sqrn;
			document.getElementById('r'+i).appendChild(sqr);
			
			var num = document.createElement('p'); //giving each square a number
			num.className = "numeration";
			document.getElementById('s' + sqrn).appendChild(num);
            var squarenum = document.createTextNode(sqrn);
            num.appendChild(squarenum);
			sqrn--;
		}
		i++;
	}
// Adding a chest at the end of the board
	var chest = document.createElement('img');
	chest.src = "images/chest.png";
	chest.className = "chest";
	document.getElementById("s64").appendChild(chest);

/******* Moving squares ***********/

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
    else if(position == 63)
        position = 17;
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


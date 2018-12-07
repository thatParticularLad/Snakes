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
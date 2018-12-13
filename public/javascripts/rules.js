var rules = document.getElementById("rules");
var exit = document.getElementById("exit");
var rulebtn = document.getElementById("rule-btn");

rulebtn.addEventListener("click", function(){ 
     rules.classList.remove("hidden");
});

exit.addEventListener("click", function(){ 
    rules.classList.add("hidden");
});


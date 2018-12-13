var stats = document.getElementById("stats");
var exit = document.getElementById("exit_stats");
var statbtn = document.getElementById("stat-btn");

statbtn.addEventListener("click", function(){ 
     stats.classList.remove("hidden");
});

exit.addEventListener("click", function(){ 
    stats.classList.add("hidden");
});
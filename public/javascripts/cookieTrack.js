

$(function(){  //shortcut for document.ready
    var info = document.createElement("p");
    info.id = "pinfo";
    var element = document.getElementById("stats");
    element.appendChild(info);

   // var cookieVal = document.cookie;  //grab the cookie
    //if( cookieVal == NaN ) {   //see if it is null
    var value = 0;
    var newcookie= "cookieValue="+value+"; expires=Thu, 18 Dec 2022 12:00:00 UTC;  path=/";
    document.cookie = newcookie;
       // cookieVal = documet.cookie;  //set the value to zero
       // console.log(cookieVal );
   // }
   
  
    value++;  //increment the value
    document.cookie = newcookie;
    document.getElementById("pinfo").innerHTML = "You have been here " + value;
    console.log(document.cookie + "bla");
});



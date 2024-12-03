// function openNav(){
//     var nav = document.getElementById("navigation");
//     var header = document.getElementById("header");
//     var close = document.getElementById("close");
//     var open = document.getElementById("open");

//     // image.src = "./images/close.png";
//     close.style.display = "block";
//     open.style.display = "none";

//     nav.style.display = "block";
//     nav.style.transition = "margin-right 3s";
//     // header.style.marginRight = "50px";


//     header.style.backgroundColor = "orange";
//     /* background-color: antiquewhite; */
// }

// function closeNav(){
//     var nav = document.getElementById("navigation");
//     var header = document.getElementById("header");

//     var open = document.getElementById("open");
//     var close = document.getElementById("close");
    
//     open.style.display = "block";
//     close.style.display = "none";

//     // image.src = "./images/open.png";
//     nav.style.display = "none";
    
//     header.style.backgroundColor = "transparent";
//     /* background-color: antiquewhite; */
// }

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("navigation").style.width = "250px";
    // document.getElementById("main").style.marginRight = "250px";

    document.getElementById("close").style.display = "block";
    document.getElementById("open").style.display = "none";

    // document.getElementById("header").style.backgroundColor = "orange";
    // header.style.backgroundColor = "orange";

  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {

    document.getElementById("navigation").style.width = "0px";
    // document.getElementById("main").style.marginRight = "0";
    // document.getElementById("header").style.backgroundColor = "transparent";
    document.getElementById("header").style.height = "fit-content";

    document.getElementById("open").style.display = "block";

    document.getElementById("close").style.display = "none";
  }
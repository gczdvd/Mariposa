/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

var ws = new WebSocket("ws://127.0.0.1:3000/live");
ws.onmessage = (e)=>{
    console.log(e.data);
}

fetch("http://127.0.0.1:3000/chat", {
    method: "GET",
    credentials: "include"
})
.then(async (e)=>{
    var resp = await e.json();
    if(resp.action == "redirect"){
        window.location.href = resp.value;
    }
    else{
        console.log(resp);
    }
});

function placeholderAdd(textarea){
  if(textarea.value.length == 0){
    textarea.innerHTML = "Üzenet...";
  }
}


/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  
}
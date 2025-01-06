Backend.setUrl("127.0.0.1:3000");

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

var ws = new WebSocket("ws://" + Backend.url() + "/live");

Backend.get({
    path:"/partners",
    callback:(e)=>{
        for(var i = 0; i < e.value.partners.length; i++){
            var _div = document.createElement("div");
            _div.className = "savedChat";
            var _img = document.createElement("img");
            _img.src = "../images/img_avatarA.png";
            var _p = document.createElement("p");
            _p.innerHTML = e.value.partners[i].partner_name;
            
            _div.appendChild(_img);
            _div.appendChild(_p);
            document.getElementById("saved").appendChild(_div);
        }
    }
});

function placeholderAdd(textarea){
  if(textarea.value.length == 0){
    textarea.innerHTML = "Üzenet...";
  }
}

function newChat(){
    Backend.get({
        path:"/chat",
        callback:(e)=>{
            console.log(e);
        }
    });
}

function openNav() {
  document.getElementById("navigation").style.width = "26vw";
  // document.getElementById("main").style.marginRight = "250px";

  document.getElementById("close").style.display = "block";
  document.getElementById("open").style.display = "none";

  document.getElementById("blurred").style.filter = "blur(2px)";
  
  // document.getElementById("navigation").style.filter = "blur(0px)";

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

  document.getElementById("blurred").style.filter = "blur(0px)";
}

function savePartner(){
  Swal.fire({
    icon: "question",
    title: "Biztosan menteni szeretnéd partnered?",
    text: "A mentési szándékról partnered értesítést kap, és elutasíthatja azt!",
    width: "64em",
    showCancelButton: "true",
    reverseButtons: "true",
    focusConfirm: "false",
    confirmButtonText: "Mentés", 
    cancelButtonText: "Mégse",
    confirmButtonColor: "#ffbc2f",
    iconColor: "#ffbc2f"
  })
}

// Swal.fire({
//   title: "Do you want to save the changes?",
//   showDenyButton: true,
//   showCancelButton: true,
//   confirmButtonText: "Save",
//   denyButtonText: `Don't save`
// }).then((result) => {
//   /* Read more about isConfirmed, isDenied below */
//   if (result.isConfirmed) {
//     Swal.fire("Saved!", "", "success");
//   } else if (result.isDenied) {
//     Swal.fire("Changes are not saved", "", "info");
//   }
// });

function reportPartner(){
  Swal.fire({
    icon: "warning",
    title: "Biztosan jelenteni szeretnéd partnered?",
    text: "A jelentés nem vonható vissza. A beszélgetés átvizsgálásához üzeneteid mentésre kerülnek.",
    width: "64em",
    showCancelButton: "true",
    reverseButtons: "true",
    // focusConfirm: "false",
    confirmButtonText: "Jelentés", 
    cancelButtonText: "Mégse",
    confirmButtonColor: "#ffbc2f",
    iconColor: "#ffbc2f"
  }).then((result) => {
    if(result.isConfirmed){
      Backend.post({path:"/report"});
      Swal.fire({
        title: "Köszönjük bejelentésed!",
        text: "Csapatunk ellenőrizni fogja a beszélgetést.",
        icon: "success",
        confirmButtonText: "Vissza a Chathez",
        width: "64em",
        confirmButtonColor: "#ffbc2f",
        iconColor: "#ffbc2f"
      });
    }
  });
}
// Kulcs: html, érték: egész html oldal
// Repülőékezettel lehet sort törni

function deletePartner(){
  Swal.fire({
    icon: "warning",
    title: "Biztosan törölni szeretnéd partnered?",
    width: "64em",
    showCancelButton: "true",
    reverseButtons: "true",
    confirmButtonText: "Törlés", 
    cancelButtonText: "Mégse",
    confirmButtonColor: "#ffbc2f",
    iconColor: "#ffbc2f"
  });
}

function send(){
    var text = document.getElementById("message").value;
    //Itt kezelni kell üres üzenetet stb...
    ws.send(JSON.stringify({
        "type":"message",
        "value":text
    }));
}

function receive(e){
    var data = JSON.parse(e.data);
    console.warn(data);
    if(data.type == "text/plain"){
        var e = document.createElement("div");
        if(data.from == 0){
            e.className = "message1";
        }
        else{
            e.className = "message2";
        }
        e.innerText = data.message;
        document.getElementsByClassName("messages")[0].insertBefore(e, document.getElementsByClassName("messages")[0].firstChild);
    }
    if(data?.identify){
        var partneridentify = JSON.parse(data.identify);
        document.getElementById("name").innerHTML = partneridentify.nickname;
        document.getElementById("quote").innerHTML = partneridentify.description;
        document.getElementById("birthday").innerHTML = function(e=new Date(partneridentify.birthdate)){
            return `${e.getUTCFullYear()}. ${(e.getMonth() < 10 ? '0' : '') + e.getMonth()}. ${(e.getDate() < 10 ? '0' : '') + e.getDate()}.`;
        }();
    }
}

ws.onmessage = receive;
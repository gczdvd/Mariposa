// Backend.setUrl("127.0.0.1:3000");

var ws;

function websocket_loop(){
    ws = new WebSocket("wss://" + Backend.url() + "/ws");
    ws.onmessage = receive;
    ws.onclose = () => {
        setTimeout(() => {
            websocket_loop();
        }, 1000);
    }
}

websocket_loop();

Backend.get({
    path:"/partners",
    callback:(e)=>{
        console.log(e);
        // if(e.value.partners.length > 0){
        //     document.getElementById("placeholder").setAttribute("hidden", "true")  //XXX
        // }
        for(var i = 0; i < e.value.partners.length; i++){
            var _div = document.createElement("div");
            _div.className = "savedChat";
            _div.setAttribute("onclick", `openChat('${e.value.partners[i].chat_id}')`);
            var _imgdiv = document.createElement("div");
            _imgdiv.classList.add("image");
            _imgdiv.style.backgroundImage = 'url("' + e.value.partners[i].profile_pic + '")';
            var _p = document.createElement("p");
            _p.innerText = e.value.partners[i].partner_name;
            
            _div.appendChild(_imgdiv);
            _div.appendChild(_p);
            document.getElementById("saved").appendChild(_div);
        }
    }
});

Backend.get({
    path:"/chat/reloaded",
    callback:(e)=>{
        console.log(e);
    }
});

function openChat(chatid=null){
    document.getElementById("success").style.display = "none";
    // document.getElementById("savedicon").click();
    
    document.getElementById("startChatAlert").style.display = "none";

    if(chatid){ 
        document.getElementById("waiting").style.display = "none";
    }
    else{
        document.getElementById("waiting").style.display = "block";
    }
    document.getElementsByClassName("messages")[0].innerHTML = "";
    Backend.post({
        path:"/chat",
        body:{
            chatid:chatid
        },
        callback:(e)=>{
            console.log(e);
            if(e.message == "connected"){
                ws.send(JSON.stringify({
                    "type":"action",
                    "value":"identity"
                }));
                ws.send(JSON.stringify({
                    "type":"action",
                    "value":"history"
                }));
            }
        }
    });
}

function savePartner(){
  Swal.fire({
    icon: "question",
    title: "Biztosan menteni szeretnéd a partnered?",
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
  .then((e)=>{
    console.log(e);
    if(e.isConfirmed){
        ws.send(JSON.stringify({
            "type":"action",
            "value":"save"
        }));
    }
    else if(e.isDenied){
      document.getElementById("save").style.visibility = "hidden";
      // TESZT
    }
    ;
  });
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
    title: "Biztosan jelenteni szeretnéd a partnered?",
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
    title: "Biztosan törölni szeretnéd a partnered?",
    width: "64em",
    showCancelButton: "true",
    reverseButtons: "true",
    confirmButtonText: "Törlés", 
    cancelButtonText: "Mégse",
    confirmButtonColor: "#ffbc2f",
    iconColor: "#ffbc2f"
  })
  .then((e)=>{
    if(e.isConfirmed){
        ws.send(JSON.stringify({
            "type":"action",
            "value":"end"
        }));
        location.reload();
    };
  });
}


// ???
// function checkEnter(){
//   document.getElementById("message")
//   .addEventListener("keyup", function(event)
//   {
//     event.preventDefault();
//     if(event.key = "Enter"){
//       send();
//     }
//   });
// }

function send(){
  //var text = document.getElementById("message").value;
  var text = document.getElementById("message-bar");
  text.style.height = "5vh";

  if(text.value != ""){
    ws.send(JSON.stringify({
      "type":"message",
      "value":text.value
    }));
    text.value = "";
  }
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
        if(data.time){
            e.setAttribute("datetime", new Date(data.time).toISOString().slice(0, 19).replace('T', ' '));
        }

        if(data.insert == "old"){
            document.getElementsByClassName("messages")[0].appendChild(e);
            console.log(data.insert);
        }
        else{
            document.getElementsByClassName("messages")[0].insertBefore(e, document.getElementsByClassName("messages")[0].firstChild);
            console.log("new");
        }
    }
    else if(data.type == "action"){
        if(data.name == "havepartner"){
            ws.send(JSON.stringify({
                "type":"action",
                "value":"identity"
            }));
            document.getElementById("success").style.display = "block";
            document.getElementById("waiting").style.display = "none";
        }
        if(data.name == "identify"){
            var partneridentify = data.value;
            document.getElementById("name").innerText = partneridentify.nickname;
            document.getElementById("quote").innerText = partneridentify.description;
            document.getElementById("profilePic").src = partneridentify.profile_pic;
            document.getElementById("birthday").innerText = function(e=new Date(partneridentify.birthdate)){
                return `${e.getUTCFullYear()}. ${((e.getMonth()+1) < 10 ? '0' : '') + (e.getMonth()+1)}. ${(e.getDate() < 10 ? '0' : '') + e.getDate()}.`;
            }();
            document.getElementById("save").setAttribute("hidden", "true");
        }
        else if(data.name == "requestSave"){
            Swal.fire({
                icon: "question",
                title: "Partnered menteni szeretne. Elfogadod?",
                width: "64em",
                showCancelButton: "true",
                reverseButtons: "true",
                confirmButtonText: "Igen", 
                cancelButtonText: "Nem",
                confirmButtonColor: "#ffbc2f",
                iconColor: "#ffbc2f"
              })
              .then((e)=>{
                
                if(e.isConfirmed){
                    
                    ws.send(JSON.stringify({
                        "type":"action",
                        "value":"save"
                    }));
                }
                // else if(e.)
                
                // ;
              });
        }
    }
}

function focusMessageBar(){
  document.getElementById("message-bar").focus();
}

var last_hist = "";
function history_load(){
    var dt = document.getElementsByClassName("messages")[0].lastChild.getAttribute("datetime");
    if(dt){
        var scrlbe = document.getElementsByClassName("messages")[0].scrollHeight - document.getElementsByClassName("messages")[0].offsetHeight;
        var scrlsp = document.getElementsByClassName("messages")[0].scrollTop;
        if(scrlbe + scrlsp < 10 && dt != last_hist){
            last_hist = dt;
            console.log(dt);
            ws.send(JSON.stringify({
                "type":"action",
                "value":"history",
                "time":dt
            }));
        }
    }
}

// document.getElementById("message").addEventListener("keyup", (e)=>{
//     if(e.key == "Enter" && document.getElementById("message").value.length != 0){
//         send();
//     }
// })

function toggleDetails(){
  var details =  document.getElementById("details");

  var saved = document.getElementById("saved");
  var navigation = document.getElementById("navigation");
  var closeSaved = document.getElementById("closeSaved");
  var openSaved = document.getElementById("openSaved");

  var closeDetails = document.getElementById("closeDetails");
  var openDetails = document.getElementById("openDetails");

  var chat = document.getElementById("chat");

  if(details.style.display == "none" || details.style.display == ""){
    details.style.display = "block";
    openDetails.style.display = "none";
    closeDetails.style.display = "block";
    
    chat.style.visibility = "hidden";

    saved.style.display = "none";
    navigation.style.display = "none";
    openSaved.style.display = "block";
    closeSaved.style.display = "none";
  }
  else{
    details.style.display = "none";
    openDetails.style.display = "block";
    closeDetails.style.display = "none";
    chat.style.visibility = "visible";
  }
}

function toggleSaved(){
  var saved = document.getElementById("saved");
  var details =  document.getElementById("details");

  var savedicon = document.getElementById("savedicon");
  var chat = document.getElementById("chat");
  var navigation = document.getElementById("navigation");

  var closeDetails = document.getElementById("closeDetails");
  var openDetails = document.getElementById("openDetails");

  if(saved.style.display == "none" || saved.style.display == ""){
    saved.style.display = "block";
    chat.style.visibility = "hidden";
    // navigation.style.display = "grid";
    navigation.style.width = "20vw";

    savedicon.style.transform = "rotateY(-180deg)";

    details.style.display = "none";
    closeDetails.style.display = "none";
    openDetails.style.display = "block";
  }
  else{
    saved.style.display = "none";
    // openSaved.style.display = "block";
    // closeSaved.style.display = "none";
    chat.style.visibility = "visible";
    // navigation.style.display = "none";
    navigation.style.width = 0;

    savedicon.style.transform = "rotateY(0)";
  }
}


Backend.get({
    path:"/userinfo",
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").getElementsByTagName("img")[0].src = e.profile_pic;
        }
    }
});

function scrollToBottom(){
  window.scrollTo(0, document.body.scrollHeight);
}

// window.onresize = function(){ location.reload(); }

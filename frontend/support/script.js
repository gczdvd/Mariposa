Backend.setUrl("127.0.0.1:3000");

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function charCounter(textarea) {

  const remChars = document.getElementById("remaining-chars");

  const maxLength = textarea.getAttribute("maxlength");

  const currentLength = textarea.value.length;

  if(textarea.value.length == 0){
    remChars.style.visibility = "hidden";
  }
  else{
    remChars.style.visibility = "visible";
    remChars.innerHTML = `${currentLength} / ${maxLength}`;
  }
}

function colorChange(inputField){
  if(inputField.value.length == 0){
    inputField.style.borderColor = "#d3d3d3";
  }
  else{
    inputField.style.borderColor = "#ffbc2f";
  }
}

function validate(){
  var email = document.getElementById("email").value;
  var fullname = document.getElementById("fullname").value;
  var message = document.getElementById("message").value;
  var allValid = true;

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var validEmail = pattern.test(email);

  if(!validEmail){
    document.getElementById("emailFeedback").style.visibility = "visible";
    document.getElementById("emailFeedback").innerHTML = "Kérjük, adj meg egy helyes email-címet!";
    var allValid = false;
  }
  else{
    document.getElementById("emailFeedback").style.visibility = "hidden";
  }

  if(fullname.length == 0){
    document.getElementById("nameFeedback").style.visibility = "visible";
    document.getElementById("nameFeedback").innerHTML = "Kérjük, adj meg egy nevet!";
    allValid = false;
  }
  else{
    document.getElementById("nameFeedback").style.visibility = "hidden";
  }

  if(message.length == 0){
    document.getElementById("messageFeedback").style.visibility = "visible";
    document.getElementById("messageFeedback").innerHTML = "Kérjük, adj meg egy üzenetet!";
    allValid = false;
  }
  else{
    document.getElementById("messageFeedback").style.visibility = "hidden";
  }

  if(allValid){
    support(email, fullname, message);
  }
}

function empty(){
  document.getElementById("email").value = "";
  document.getElementById("fullname").value = "";
  document.getElementById("username").value = "";
  document.getElementById("message").value = "";
  document.getElementById("remaining-chars").innerHTML = "";
}

function support(email, name, message){
    Backend.post({
        "path":"/message",
        "body":{
            "email":email,
            "name":name,
            "text":message
        },
        "callback":supportResponse
    });
}

function supportResponse(e){
  if(e.message == "Success"){
    Swal.fire({
      icon: "success",
      iconColor: "#ffbc2f",
      title: "Üzenet sikeresen elküldve!",
      text: "Ügyfélszolgálatunk hamarosan felveszi Veled a kapcsolatot.",
      width: "64em",
      confirmButtonText: "Rendben!", 
      showCancelButton: false,
      confirmButtonColor: "#ffbc2f",
    }).then((result) => {
      if(result.isConfirmed){
        empty();
      }
    })
  }
  else{
    Swal.fire({
      icon: "error",
      iconColor: "#ffbc2f",
      title: "Az üzenet küldése sikertelen.",
      text: "Kérjük, próbáld meg később!",
      width: "64em",
      confirmButtonText: "Rendben!", 
      showCancelButton: false,
      confirmButtonColor: "#ffbc2f",
    })
  }
}

Backend.get({
    path:"/userinfo",
    blockRedirect: false,
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").style.backgroundImage = `url('${e.profile_pic}')`;
        }
    }
});
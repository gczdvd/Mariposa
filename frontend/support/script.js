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

function emailValid(){
  var email = document.getElementById("email");
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var validEmail = pattern.test(email.value);

  if(!validEmail){
    email.classList.add("is-invalid");
    email.style.borderColor = "#dc3545";
    email.style.color = "#dc3545";
    return false;
  }
  else{
    email.classList.remove("is-invalid");
    email.style.borderColor = "#ffbc2f";
    email.style.color = "#ffbc2f";
    return true;
  }
}

function fullnameValid(){
  var fullname = document.getElementById("fullname");

  if(!fullname.value){
    fullname.classList.add("is-invalid");
    fullname.style.borderColor = "#dc3545";
    fullname.style.color = "#dc3545";
    return false;
  }
  else{
    fullname.classList.remove("is-invalid");
    fullname.style.borderColor = "#ffbc2f";
    fullname.style.color = "#ffbc2f";
    return true;
  }
}

function messageValid(){
  var message = document.getElementById("message");

  if(!message.value){
    message.classList.add("is-invalid");
    message.style.borderColor = "#dc3545";
    message.style.color = "#dc3545";
    return false;
  }
  else{
    message.classList.remove("is-invalid");
    message.style.borderColor = "#ffbc2f";
    message.style.color = "#ffbc2f";
    return true;
  }
}

function validate(){
  var email = emailValid();
  var fullname = fullnameValid();
  var message = messageValid();
  var username = document.getElementById("username");
  var allValid;

  username.style.borderColor = "#ffbc2f";
  username.style.color = "#ffbc2f";

  if(!email || !fullname || !message){
    allValid = false;
    emailValid();
    fullnameValid();
    messageValid();
  }
  else{
    allValid = true;
  }

  if(allValid){
    var emailValue = document.getElementById("email").value;
    var fullnameValue = document.getElementById("fullname").value;
    var usernameValue = document.getElementById("username").value;
    var messageValue = document.getElementById("message").value;


    support();
  }
}

function empty(){
  document.getElementById("email").value = "";
  document.getElementById("fullname").value = "";
  document.getElementById("username").value = "";
  document.getElementById("message").value = "";
  document.getElementById("remaining-chars").innerHTML = "";
}

// ÁTÍRNI A BACKENDBEN

function support(emailValue, fullnameValue, usernameValue, messageValue){
    Backend.post({
        "path":"/message",
        "body":{
            "email":emailValue,
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
      title: "Az üzenet küldése sikertelen volt.",
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

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
// Backend.setUrl("127.0.0.1:3000");

function showMore(accordion){
  var panel = accordion.nextElementSibling;
  if(panel.style.maxHeight){
    accordion.getElementsByClassName("arrow")[0].innerHTML = "&#8595;";
    panel.style.maxHeight = null;
  }
  else{
    accordion.getElementsByClassName("arrow")[0].innerHTML = "&#8593;";
    panel.style.maxHeight = panel.style.maxHeight + "50vh";
  }
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
    return email.value;
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
    email.classList.remove("is-invalid");
    email.style.borderColor = "#ffbc2f";
    email.style.color = "#ffbc2f";
    return fullname.value;
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
    return message.value;
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
    support(email, username, fullname, message);
  }
}

function support(email, username, name, message){
    Backend.post({
        "path":"/message",
        "body":{
            "email":email,
            "username":username,
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
      showCancelButton: "false",
      confirmButtonColor: "#ffbc2f",
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
      showCancelButton: "false",
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
// Backend.setUrl("127.0.0.1:3000");

function showMore(accordion){
  var panel = accordion.nextElementSibling;
  if(panel.style.maxHeight){
    document.getElementById("arrow").innerHTML = "&#8595;";
    panel.style.maxHeight = null;
  }
  else{
    document.getElementById("arrow").innerHTML = "&#8593;";
    panel.style.maxHeight = panel.style.maxHeight + "40vh";
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

function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("moreText");

  if (dots.style.display === "none") {
    dots.style.display = "block";
    moreText.style.display = "none";
    
  } else {
    dots.style.display = "none";
    moreText.style.display = "block";
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
    document.getElementById("emailFeedback").innerHTML = "Helytelen email-cím.";
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
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").getElementsByTagName("img")[0].src = e.profile_pic;
        }
    }
});
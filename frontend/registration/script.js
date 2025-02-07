Backend.setUrl("127.0.0.1:3000");

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

function togglePSW() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById("toggleIcon").innerHTML = "👁️";
      
    } else {
      x.type = "password";
      document.getElementById("toggleIcon").innerHTML = "🕳️";
    }
}

function colorChange(textarea){
    const remChars = document.getElementById("remaining-chars");
    // const maxLength = textarea.getAttribute("maxlength");
  
    if(textarea.value.length == 0){
      textarea.style.borderColor = "#d3d3d3";
      remChars.style.visibility = "hidden";
    }
    else{
      textarea.style.borderColor = "#ffbc2f";
      remChars.style.visibility = "visible";
    }
  }
  textarea.onfocusout = () => colorChange(textarea);
  

function registration(){
    var email = document.getElementById("email").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password").value;
    var checkbox = document.getElementById("checkbox").checked;
    var allValid = true;

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var validEmail = pattern.test(email);
  
    if(!validEmail){
      emailFeedback.style.visibility = "visible";
      document.getElementById("emailFeedback").innerHTML = "Helytelen email-cím.";
      var allValid = false;
    }
    else{
      emailFeedback.style.visibility = "hidden";
    }

    if(password.length != 10){
      pswFeedback.style.visibility = "visible";
      document.getElementById("pswFeedback").innerHTML = "A jelszónak legalább 10 karakternek kell lennie.";
      var allValid = false;
    }
    else{
      pswFeedback.style.visibility = "hidden";
    }

    if(!checkbox){
      checkboxFeedback.style.visibility = "visible";
      document.getElementById("checkboxFeedback").innerHTML = "El kell fogadnod az ÁSZF-et!";
      var allValid = false;
    }
    else{
      checkboxFeedback.style.visibility = "hidden";
    }

    if(allValid){
      Backend.post({
        path:"/signup",
        body:{
            email:email,
            nickname:nickname,
            password:password
        },
        callback:(e)=>{
          e
        }
    });
    }
}

// function checkValidation(){
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;

 

  
    
// }
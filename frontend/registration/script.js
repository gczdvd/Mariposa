Backend.setUrl("127.0.0.1:3000");

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
    if(textarea.value.length == 0){
      textarea.style.borderColor = "#d3d3d3";
      remChars.style.visibility = "hidden";
    }
    else{
      textarea.style.borderColor = "#ffbc2f";
      remChars.style.visibility = "visible";
    }
  }  

function registration(){
    var email = document.getElementById("email").value;
    var username = document.getElementById("username");
    var checkbox = document.getElementById("checkbox").checked;
    var allValid = true;

    console.log(email);
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

    checkPassword();

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

function checkPassword(){
  var password = document.getElementById("password").value;
  var lowercase = false;
  var uppercase = false;
  
  for(var i = 0; i < password.length; i++){
    
    if(password[i] == password[i].toLowerCase()){
      lowercase = true;
    }
    else if(password[i] == password[i].toUpperCase()){
      uppercase = true;
    }
  }

  if(lowercase && uppercase && password.length >= 12){
    console.log("jojelszo");
    document.getElementById("pswFeedback").style.visibility = "hidden";
  }
  else{
    console.log("nemjojelszo");
    document.getElementById("pswFeedback").style.visibility = "visible";
  }
}

document.getElementById("password").addEventListener("keyup", checkPassword);

// function checkValidation(){
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;

 

  
    
// }
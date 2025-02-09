Backend.setUrl("127.0.0.1:3000");

var token = (new URLSearchParams(location.search))?.get("token");
if(token){
    Backend.get({
        path:"/signup/verify?token=" + token,
        callback:(e)=>{
            console.log(e);
            if(e.action == "alert"){
                alert(e.value);
            }
        }
    });
}

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
  }
  else{
    textarea.style.borderColor = "#ffbc2f";
  }
}

function login(){
  var email = document.getElementById("email").value;
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

  if(allValid){
    Backend.post({
      path:"/login", 
      body:{
          email: email, 
          password: password
      },
      callback:console.log
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
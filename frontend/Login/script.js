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

function getCookie(key){
    var coos = document.cookie.split(';');
    for(var i = 0; i < coos.length; i++){
        var tmp = coos[i].trim().split('=');
        if(key == tmp[0]){
            return tmp[1];
        }
    };
    return null;
}

function setCookie(key, value){
    document.cookie = key + "=" + value + ";";
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
    document.getElementById("emailFeedback").innerHTML = "Helytelen email-cím";
    var allValid = false;
  }
  else{
    emailFeedback.style.visibility = "hidden";
  }

  if(!automatic){
    var jelszo = checkPassword();
    if(!jelszo){
        allValid = false;
    }
  }

  if(allValid){
    if(automatic){
        var precode = getCookie("password");
    }
    else{
        var precode = CryptoJS.SHA256(jelszo).toString();
    }
    console.log("precode", precode);
    if(document.getElementById("rememberme").checked){
        setCookie("email", email);
        setCookie("password", precode);
    }
    var timekey = String((new Date).getTime());
    console.log("timekey", timekey);
    var key = CryptoJS.SHA256(timekey + precode).toString();
    console.log("key", key);
    var fullkey = timekey + ',' + key;
    console.log("fullkey", fullkey);
    Backend.post({
      path:"/login", 
      body:{
          email: email, 
          password: fullkey
      },
      callback: (e) => {
        if(e.value == "invalid"){
          document.getElementById("emailFeedback").innerHTML = "Nincs ilyen email-címmel a rendszerünkben.";
        }
        else{
          document.getElementById("emailFeedback").innerHTML = "";
        }
      }
  });
  }
}

function checkPassword(){
    automatic = false;
    
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
  document.getElementById("pswFeedback").innerHTML = "";
  return password;
}
else{
  document.getElementById("pswFeedback").innerHTML = "Legalább 12 karakter, kis- és nagybetű egyaránt";
  return false;
}
}

document.getElementById("password").addEventListener("keyup", checkPassword);

var automatic = false;
if(getCookie("email") && getCookie("password")){
    automatic = true;
    document.getElementById("password").value = "************";
    document.getElementById("email").value = getCookie("email");
}

async function forgotPassword(){
  Swal.fire({
      icon: "warning",
      title: "Add meg a Mariposa fiókodhoz tartozó e-mail címet!",
      text: "Az e-mailben szereplő linkkel tudod majd visszaállítani a jelszavad.",
      input: "email",
      validationMessage: "Helytelen e-mail cím",
      width: "64em",
      showCancelButton: "true",
      showConfirmButton: "true",
      reverseButtons: "true",
      focusConfirm: "false",
      confirmButtonText: "Küldés",
      cancelButtonText: "Bezárás",
      confirmButtonColor: "#ffbc2f",
      iconColor: "#ffbc2f",
      preConfirm: (pno) => {
        return axios.post('/some/route', { pno })
            .then(response => { 
                // ...
            })
            .catch(error => {
                if (error.response.status === 404) {
                    MySwal.showValidationMessage(error.response.data.message)                        
                }                        
            });
      } 
  }).then((swBtn)=>{
    if(swBtn.isConfirmed == true){
      
      Backend.post({
        path:"/forgotpassword",
        body:{
            email: e.value
        },
        callback: validateEmail(e)
      });
    }
  });
}

function validateEmail(e){
  if(e.action === "error"){
    Swal.fire({
      icon: "error",
      title: "Add meg a Mariposa fiókodhoz tartozó email-címet!",
      text: "Az emailben szereplő linkkel tudod majd visszaállítani a jelszavad.",
      input: "email",
      validationMessage: "Helytelen e-mail cím",
      width: "64em",
      showCancelButton: "true",
      showConfirmButton: "true",
      reverseButtons: "true",
      focusConfirm: "false",
      confirmButtonText: "Küldés",
      cancelButtonText: "Bezárás",
      confirmButtonColor: "#ffbc2f",
      iconColor: "#ffbc2f",
    })
  }
}
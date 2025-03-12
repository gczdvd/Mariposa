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
      // textarea.style.borderColor = "#d3d3d3";
    }
    else{
      // textarea.style.borderColor = "#ffbc2f";
    }
}  

function passwordValid(){
  var password = document.getElementById("password");
  var passwordValue = password.value;
  // var passwordField = document.getElementById("password");
  var lowercase = false;
  var uppercase = false;
  
  for(var i = 0; i < passwordValue.length; i++){ 
    if(passwordValue[i] == passwordValue[i].toLowerCase()){
      lowercase = true;
    }
    else if(passwordValue[i] == passwordValue[i].toUpperCase()){
      uppercase = true;
    }
  }

  if(lowercase && uppercase && passwordValue.length >= 12){
    // document.getElementById("pswFeedback").innerHTML = "";
    password.classList.remove("is-invalid");
    password.style.borderColor = "#ffbc2f";
    return password;
  }
  else{
    // document.getElementById("pswFeedback").innerHTML = "Legalább 12 karakter, kis- és nagybetű egyaránt";
    password.classList.add("is-invalid");
    password.style.borderColor = "#dc3545";
    // document.getElementById("password").style.borderColor = "#d3d3d3";
    return false;
  }
}

// document.getElementById("password").addEventListener("keyup", checkPassword);

function usernameValid(){
  var username = document.getElementById("username");

  if(username.value.length == 0){
    // document.getElementById("usernameFeedback").innerHTML = "Kérjük, adj meg egy felhasználónevet!";
    username.classList.add("is-invalid");
    username.style.borderColor = "#dc3545";
    return false;
  }
  else{
    // document.getElementById("usernameFeedback").innerHTML = "";
    username.classList.remove("is-invalid");
    username.style.borderColor = "#ffbc2f";
    return true;
  }
}

function emailValid(){
  var email = document.getElementById("email");
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var validEmail = pattern.test(email.value);

  if(!validEmail){
    // document.getElementById("emailFeedback").innerHTML = "Kérjük, adj meg egy helyes email-címet!";
    email.classList.add("is-invalid");
    email.style.borderColor = "#dc3545";
    return false;
  }
  else{
    // document.getElementById("emailFeedback").innerHTML = "";
    email.classList.remove("is-invalid");
    email.style.borderColor = "#ffbc2f";
    return true;
  }
}

function checkboxValid(){
  var checkbox = document.getElementById("checkbox").checked;

  if(!checkbox){
    // checkboxFeedback.style.visibility = "visible";
    // document.getElementById("checkboxFeedback").innerHTML = "El kell fogadnod az ÁSZF-et!";
    document.getElementById("TANDC").style.color = "#dc3545";
    return false;
  }
  else{
    // document.getElementById("checkboxFeedback").innerHTML = "";
    document.getElementById("TANDC").style.color = "#000";
    return true;
  }
}

function registration(){    
    var allValid;

    var password = passwordValid();
    var email = emailValid();
    var username = usernameValid();
    var checkbox = checkboxValid();

    if(!password || !email || !username || !checkbox){      
      allValid = false;
    }
    else{
      allValid = true;
    }

    if(allValid){
      
      Swal.fire({
        icon: "success",
        iconColor: "#ffbc2f",
        title: "Nézd meg az email-fiókod a visszaigazoló emailért!",
        html: `
        <button onclick="location.href='https://mail.google.com/mail/u/0/#inbox';" class="primaryBTN" style="margin-top: 1em">Gmail megnyitása</button>
        `,

        width: "64em",
        showCancelButton: false,
        showConfirmButton: false
      });
        
      var key = CryptoJS.SHA256(jelszo).toString();
      Backend.post({
        path:"/signup",
        body:{
            email:email,
            nickname:username,
            password:key
        },
        callback:(e)=>{

        }
      });
    }
}

function togglePassword(){
  var psw = document.getElementById("password");
  if (psw.type === "password") {
    psw.type = "text";
    document.getElementById("togglePassword").src = "/_images/hide.png";
  } else {
    psw.type = "password";
    document.getElementById("togglePassword").src = "/_images/view.png";
  }
}

// function checkValidation(){
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("password").value;

// }


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
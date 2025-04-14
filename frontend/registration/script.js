Backend.setUrl("127.0.0.1:3000");

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
    document.getElementById("pswFeedback").innerHTML = "";
    password.classList.remove("is-invalid");
    password.style.borderColor = "#ffbc2f";
    password.style.color = "#ffbc2f";
    return passwordValue;
  }
  else{
    password.classList.add("is-invalid");
    document.getElementById("pswFeedback").innerHTML = "Legalább 12 karakter, kis- és nagy betű egyaránt";
    password.style.borderColor = "#dc3545";
    password.style.color = "#dc3545";
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
    username.style.color = "#dc3545";
    return false;
  }
  else{
    // document.getElementById("usernameFeedback").innerHTML = "";
    username.classList.remove("is-invalid");
    username.style.borderColor = "#ffbc2f";
    username.style.color = "#ffbc2f";
    return username.value;
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

function checkboxValid(){
  var checkbox = document.getElementById("checkbox").checked;

  if(!checkbox){
    document.getElementById("TANDC").style.color = "#dc3545";
    document.getElementById("checkboxLabel").style.textDecoration = "underline";
    document.getElementById("checkboxLabel").style.textUnderlineOffset = "6px";
    return false;
  }
  else{
    document.getElementById("TANDC").style.color = "#ffbc2f";
    document.getElementById("checkboxLabel").style.textDecoration = "none";
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
        
      var key = CryptoJS.SHA256(password).toString();
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

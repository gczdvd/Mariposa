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
    }
    else{
      textarea.style.borderColor = "#ffbc2f";
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
    document.getElementById("pswFeedback").innerHTML = "";
    return true;
  }
  else{
    document.getElementById("pswFeedback").innerHTML = "Legalább 12 karakter, kis- és nagybetű egyaránt";
    return false;
  }
}

document.getElementById("password").addEventListener("keyup", checkPassword);

function registration(){
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var checkbox = document.getElementById("checkbox").checked;
    var allValid = true;

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var validEmail = pattern.test(email);
  
    if(!validEmail){
      document.getElementById("emailFeedback").innerHTML = "Helytelen email-cím";
      allValid = false;
    }
    else{
      document.getElementById("emailFeedback").innerHTML = "";
    }

    if(!checkPassword()){      
      allValid = false;
    }

    if(username.length == 0){
      document.getElementById("usernameFeedback").innerHTML = "Kérjük, adj meg egy felhasználónevet!";
      allValid = false;
    }
    else{
      document.getElementById("usernameFeedback").innerHTML = "";
    }

    if(!checkbox){
      checkboxFeedback.style.visibility = "visible";
      document.getElementById("checkboxFeedback").innerHTML = "El kell fogadnod az ÁSZF-et!";
      allValid = false;
    }
    else{
      document.getElementById("checkboxFeedback").innerHTML = "";
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
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
      iconColor: "#ffbc2f"
  }).then((swBtn)=>{
    if(swBtn.isConfirmed == true){
      console.log(swBtn);
      Backend.post({
        path:"/forgotpassword",
        body:{
            email: swBtn.value
        },
        callback: console.log
      });
      Swal.fire({
        icon: "warning",
        title: "Nézd meg az email-fiókod!",
        html: `
        <button onclick="location.href='https://mail.google.com/mail/u/0/#inbox';" class="primaryBTN" style="margin-top: 1em">Gmail megnyitása</button>
        `,
        width: "64em",
        showCancelButton: false,
        showConfirmButton: false
      });
    }
  });
}


function passwordValid(password){
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
    password.classList.remove("is-invalid");
    password.style.borderColor = "#ffbc2f";
    password.style.color = "#ffbc2f";
    return passwordValue;
  }
  else{
    password.classList.add("is-invalid");
    password.style.borderColor = "#dc3545";
    password.style.color = "#dc3545";
    return false;
  }
}

function same(){
  var password1 = document.getElementById("password1");
  var password2 = document.getElementById("password2");

  if(password1.value == password2.value){
    password2.classList.remove("is-invalid");
    password2.style.borderColor = "#ffbc2f";
    password2.style.color = "#ffbc2f";

    document.getElementById("bothPassFeedback").innerHTML = "";    
  }
  else{
    password2.classList.add("is-invalid");
    password2.style.borderColor = "#dc3545";
    password2.style.color = "#dc3545";

    document.getElementById("bothPassFeedback").innerHTML = "A két jelszó nem egyezik";
  }
}

document.getElementById("password2").addEventListener("keydown", same);


function save(){
  var oldPass = document.getElementById("curPassword");
  var nw1Pass = document.getElementById("password1");
  var nw2Pass = document.getElementById("password2");

  if(validate() && nw1Pass.value == nw2Pass.value){
    var precode = CryptoJS.SHA256(oldPass.value).toString();
    var timekey = String((new Date).getTime());
    var key = CryptoJS.SHA256(timekey + precode).toString();
    var fullkey = timekey + ',' + key;

    Backend.post({
      path:"/modifypassword", 
      body:{
          newpassword: CryptoJS.SHA256(nw1Pass.value).toString(), 
          oldpassword: fullkey
      },
      callback: (e) => {
        if(e.message == "Bad old password."){
          document.getElementById("curPassFeedback").innerHTML = "Helytelen jelszó";
        }
        else{
          document.getElementById("curPassFeedback").innerHTML = "";
          Swal.fire({
            icon: "success",
            title: "Sikeres mentés!",
            width: "64em",
            showCancelButton: false,
            showConfirmButton: true,
            focusConfirm: false,
            confirmButtonText: "Rendben!",
            confirmButtonColor: "#ffbc2f",
            iconColor: "#ffbc2f"
          }).then((result)=>{
            if(result.isConfirmed){
              window.location.href = "/profilesettings";
            }
          });
        }
      }
    });
  }
}

function togglePassword(togglePassword){
  var psw = togglePassword.parentElement.previousElementSibling;

  if (psw.type === "password") {
    psw.type = "text";
    togglePassword.src = "/_images/hide.png";
  } else {
    psw.type = "password";
    togglePassword.src = "/_images/view.png";
  }
}

Backend.get({
  path:"/userinfo",
  callback:(e)=>{
      if(e.id != undefined){
          document.getElementById("optprofile").style.backgroundImage = `url('${e.profile_pic}')`;
      }
  }
});
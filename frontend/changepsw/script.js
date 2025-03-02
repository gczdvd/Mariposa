function colorChange(textarea){
    if(textarea.value.length == 0){
      textarea.style.borderColor = "#d3d3d3";
    }
    else{
      textarea.style.borderColor = "#ffbc2f";
    }
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


function forgotPassword(){
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
  })
}

function validate(){
  var newPassword1 = document.getElementById("password1").value;
  var lowercase = false;
  var uppercase = false;

  for(var i = 0; i < newPassword1.length; i++){
    if(newPassword1[i] == newPassword1[i].toLowerCase()){
      lowercase = true;
    }
    else if(newPassword1[i] == newPassword1[i].toUpperCase()){
      uppercase = true;
    }
  }

  if(lowercase && uppercase && newPassword1.length >= 12){
    document.getElementById("newPassFeedback").innerHTML = "";
    return newPassword1;
  }
  else{
    document.getElementById("newPassFeedback").innerHTML = "Legalább 12 karakter, kis- és nagybetű egyaránt";
    return false;
  }
}
document.getElementById("password1").addEventListener("keyup", validate);


function same(){
  if(document.getElementById("password1").value == document.getElementById("password2").value){
    document.getElementById("bothPassFeedback").innerHTML = "";
  }
  else{
    document.getElementById("bothPassFeedback").innerHTML = "A két jelszó nem egyezik";
  }
}
document.getElementById("password2").addEventListener("keyup", same);


function save(){
  var oldPass = document.getElementById("curPassword");
  var nw1Pass = document.getElementById("password1");
  var nw2Pass = document.getElementById("password2");

  if(validate() && nw1Pass.value == nw2Pass.value){
    Backend.post({
      path:"/modifypassword", 
      body:{
          newpassword: nw1Pass.value, 
          oldpassword: oldPass.value
      },
      callback: (e) => {
        if(e.message == "Bad old password."){
          document.getElementById("curPassFeedback").innerHTML = "Helytelen jelszó";
        }
        else{
          document.getElementById("curPassFeedback").innerHTML = "";
        }
      }
    });
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

function response(){

}
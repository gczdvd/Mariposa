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

function checkPassword(){
    var password = document.getElementById("password1").value;
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
      document.getElementById("newPassFeedback").innerHTML = "";
      return password;
    }
    else{
      document.getElementById("newPassFeedback").innerHTML = "Legalább 12 karakter, kis- és nagybetű egyaránt";
      return false;
    }
}
  
document.getElementById("password1").addEventListener("keyup", checkPassword);

function subm(){
    var jelszo = checkPassword();
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password1").value;
    var key = (new URLSearchParams(window.location.search)).get("key");
    if(jelszo && password1 == password2 && key){
      Swal.fire({
        icon: "success",
        iconColor: "#ffbc2f",
        title: "Sikerült",

        width: "64em",
        showCancelButton: false,
        showConfirmButton: false
      });
        
      var passcry = CryptoJS.SHA256(password1).toString();
      Backend.post({
        path:"/forgotpassword/change",
        body:{
            key:key,
            password:passcry
        },
        callback:(e)=>{
            console.log(e);
        }
      });
    }
}
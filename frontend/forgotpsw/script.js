function colorChange(textarea){
    if(textarea.value.length == 0){
      textarea.style.borderColor = "#d3d3d3";
    }
    else{
      textarea.style.borderColor = "#ffbc2f";
    }
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
      document.getElementById("bothPassFeedback").innerHTML = "A két jelszó nem egyezik!";
    }
  }

  document.getElementById("password2").addEventListener("keyup", same);

function subm(){
    var jelszo = validate();
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password1").value;
    var key = (new URLSearchParams(window.location.search)).get("key");
    if(jelszo && password1 == password2 && key){
      
        
      var passcry = CryptoJS.SHA256(password1).toString();
      Backend.post({
        path:"/forgotpassword/change",
        body:{
            key:key,
            password:passcry
        },
        callback:(e)=>{
            console.log(e);
            if(e.message == "Success"){
              Swal.fire({
                icon: "success",
                iconColor: "#ffbc2f",
                title: "Sikeres jelszóvisszaállítás!",
                confirmButtonText: "Rendben!",
                confirmButtonColor: "#ffbc2f",
                width: "64em",
                showCancelButton: false,
                showConfirmButton: true,
              }).then((result) => {
                if(result.isConfirmed){
                  window.location.href = "/login";
                }
              });
            }
        }
      });
    }
}
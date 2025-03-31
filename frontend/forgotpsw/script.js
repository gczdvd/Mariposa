function passwordValid(password){
  var passwordValue = password.value;
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
    return password;
  }
  else{
    password.classList.add("is-invalid");
    password.style.borderColor = "#dc3545";
    password.style.color = "#dc3545";
    return false;
  }
}

document.getElementById("password1").addEventListener("keyup", same());

function same(){
  if(document.getElementById("password1").value == document.getElementById("password2").value){
    document.getElementById("bothPassFeedback").innerHTML = "";
  }
  else{
    document.getElementById("bothPassFeedback").innerHTML = "A két jelszó nem egyezik!";
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

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

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
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

function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    Backend.post({
        path:"/login", 
        body:{
            email: email, 
            password: password
        },
        callback:console.log
    });
}

function colorChange(textarea){
  const remChars = document.getElementById("remaining-chars");
  // const maxLength = textarea.getAttribute("maxlength");

  if(textarea.value.length == 0){
    textarea.style.borderColor = "#d3d3d3";
    remChars.style.visibility = "hidden";
  }
  else{
    textarea.style.borderColor = "#ffbc2f";
    remChars.style.visibility = "visible";
  }
}
textarea.onfocusout = () => colorChange(textarea);
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
  

function registration(){
    var email = document.getElementById("email").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password").value;

    
    Backend.post({
        path:"/signup",
        body:{
            email:email,
            nickname:nickname,
            password:password
        },
        callback:console.log
    });
}
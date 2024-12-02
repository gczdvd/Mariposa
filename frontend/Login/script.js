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

    fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email, 
            password: password
        }) 
    })
    .then(async (e)=>{
        var resp = await e.json();
        if(resp.action == "redirect"){
            window.location.href = resp.value;
        }
        else{
            console.log(resp);
        }
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
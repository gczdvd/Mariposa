// function togglePSW(toggle) {
//     var x = toggle.previousSibling;

//     if (x.type == "password") {
//       x.type = "text";
//       toggle.innerHTML = "👁️";
      
//     } else {
//       x.type = "password";
//       toggle.innerHTML = "🕳️";
//     }
// }


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
// textarea.onfocusout = () => colorChange(textarea);


function checkPassword(){
  var password1 = document.getElementById("password1");
  var password2 = document.getElementById("password2");
  const response = document.getElementById("response");

  if(password1 != password2){
    response.innerHTML = "A két jelszó nem egyezik.";
  }else{
    if(password1.toLowerCase() == password1){
      response.innerHTML = "A jelszónak tartalmaznia kell nagybetűket!";
    }else{
      if(password1.toUpperCase() == password1){
        response.innerHTML = "A jelszónak tartalmaznia kell kisbetűket!";
      }else{
        // Itt jó
      }
    }
  }
}
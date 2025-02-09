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
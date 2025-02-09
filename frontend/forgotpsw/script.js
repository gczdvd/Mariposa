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
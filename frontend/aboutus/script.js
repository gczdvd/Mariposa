function charCounter(textarea) {

  const remChars = document.getElementById("remaining-chars");

  const maxLength = textarea.getAttribute("maxlength");

  const currentLength = textarea.value.length;

  if(textarea.value.length == 0){
    remChars.style.visibility = "hidden";
  }
  else{
    remChars.style.visibility = "visible";
    remChars.innerHTML = `${currentLength} / ${maxLength}`;
  }
}


function colorChange(inputField){
  if(inputField.value.length == 0){
    inputField.style.borderColor = "#d3d3d3";
  }
  else{
    inputField.style.borderColor = "#ffbc2f";
  }
}
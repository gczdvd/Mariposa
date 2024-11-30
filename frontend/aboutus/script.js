// const textarea = document.getElementById("textarea");

function charCounter(textarea) {
  const remChars = document.getElementById("remaining-chars");
  remChars.style.visibility = "visible";
  const maxLength = textarea.getAttribute("maxlength");
  const currentLength = textarea.value.length;
  remChars.innerHTML = `${currentLength} / ${maxLength}`;
  
}

function colorChange(inputField){
  const remChars = document.getElementById("remaining-chars");
  // const maxLength = textarea.getAttribute("maxlength");

  if(inputField.value.length == 0){
    inputField.style.borderColor = "#d3d3d3";
    remChars.style.visibility = "hidden";
  }
  else{
    inputField.style.borderColor = "#ffbc2f";
    remChars.style.visibility = "visible";
  }
}

// textarea.oninput = () => charCounter(textarea);
// textarea.onfocus = () => charCounter(textarea);
textarea.onfocus = () => charCounter(textarea);
textarea.onfocusout = () => colorChange(textarea);
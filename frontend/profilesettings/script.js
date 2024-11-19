const textarea = document.getElementById("textarea");
function charCounter(inputField) {

  const remChars = document.getElementById("remaining-chars");

  const maxLength = inputField.getAttribute("maxlength");
  const currentLength = inputField.value.length;
  remChars.style.visibility = "visible";
  remChars.innerHTML = `${currentLength} / ${maxLength}`;
  
}
textarea.oninput = () => charCounter(textarea);
textarea.onfocus = () => charCounter(textarea);


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
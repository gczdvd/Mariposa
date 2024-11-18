// Animált accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

  });
}

function myFunction() {
  var x = document.getElementById("navigation");
  var logo = document.getElementById("logo");
  

  if (x.style.display === "block") {
    
    x.style.display = "none";
    
  } else {

    x.style.display = "block";
    
  }
}


const textarea = document.getElementById("textarea");
function charCounter(inputField) {

  const remChars = document.getElementById("remaining-chars");
  remChars.style.visibility = "visible";
  const maxLength = inputField.getAttribute("maxlength");
  const currentLength = inputField.value.length;
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
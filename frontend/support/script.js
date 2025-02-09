// Backend.setUrl("127.0.0.1:3000");

// function accordionSwap(){
  
// }

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


// function support(){
//     //VIZSGÁLNI, HOGY MINDENJÓ
//     var email = document.getElementById("support_email").value;
//     var name = document.getElementById("support_name").value;
//     var message = document.getElementById("textarea").value;

//     Backend.post({
//         "path":"/message",
//         "body":{
//             "email":email,
//             "name":name,
//             "text":message
//         },
//         "callback":console.log
//     });
// }
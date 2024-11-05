// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     /* Toggle between adding and removing the "active" class,
//     to highlight the button that controls the panel */
//     this.classList.toggle("active");

//     /* Toggle between hiding and showing the active panel */
//     var panel = this.nextElementSibling;
//     if (panel.style.display === "block") {
//       panel.style.display = "none";
//     } else {
//       panel.style.display = "block";
//     }
//   });
// }

// Animált
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


// Textarea karakterlimit jelző
const textarea = document.getElementById("textarea");

function charCounter(inputField) {
  
  const remChars = document.getElementById("remaining-chars");
  const maxLength = inputField.getAttribute("maxlength");
  const currentLength = inputField.value.length;

  const progressWidth = (currentLength / maxLength) * 100;
  // remChars.style.display = "none";

  if (progressWidth <= 90) {
    remChars.innerHTML = `${maxLength - currentLength} karakter maradt`;
    // remChars.style.display = "block";
  }
}

textarea.onfocus = () => charCounter(textarea);
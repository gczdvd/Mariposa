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



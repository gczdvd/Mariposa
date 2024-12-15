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



function chosenInterest(interest){
  if(interest.classList.contains("notSelected")){
    interest.classList.remove("notSelected");
    interest.classList.add("selected");
  }
  else{
    interest.classList.remove("selected");
    interest.classList.add("notSelected");
  }
}

// ha van kiválasztva érdeklődési kör, a felette lévő cím színe narancssárga legyen
// ciklussal végigmegyünk az összes details-en - külső ciklus
// belső ciklus: éppen aktuális details-eken belül lévő összes button-ön végigmegyünk
// valamelyiknek a classa selected-e
// ha igen: éppen kiválasztott details style color narancs
// ha nem: éppen kiválasztott details style color fekete

// mentés gomb elküldi az adatokat, visszajön a válasz, ha sikeres, akkor sikeresen mentésre kerültek, ha nem, akkor szerverhiba
function saveData(){
  var success = false;
  // var success = true;
  if(success){
    Swal.fire({
      icon: "success",
      title: "Az adatok sikeresen mentésre kerültek!",
      // text: "A mentési szándékról partnered értesítést kap, és elutasíthatja azt!",
      width: "64em",
      showCancelButton: "true",
      showConfirmButton: "false",
      reverseButtons: "true",
      focusConfirm: "false",
      confirmButtonText: "Tovább a chatre",
      cancelButtonText: "Bezárás",
      confirmButtonColor: "#ffbc2f",
      iconColor: "#ffbc2f"
    })
  }
  else{
    Swal.fire({
      icon: "error",
      title: "Az adatok mentése során hibába ütköztünk!",
      width: "64em",
      // focusConfirm: "false",
      confirmButtonText: "Bezárás",
      confirmButtonColor: "#545454",
      iconColor: "#ffbc2f"
    })
  }
}
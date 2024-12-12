let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("slides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "grid";
  setTimeout(showSlides, 10000); // Change image every 2 seconds
}

function myFunction() {
  var x = document.getElementById("navigation");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function openNav() {
  document.getElementById("navigation").style.width = "50vw";
  document.getElementById("close").style.display = "block";
  document.getElementById("open").style.display = "none";

  document.getElementById("blurred").style.filter = "blur(2px)";
}


function closeNav() {

  document.getElementById("navigation").style.width = "0px";
  document.getElementById("header").style.height = "fit-content";

  document.getElementById("open").style.display = "block";

  document.getElementById("close").style.display = "none";

  document.getElementById("blurred").style.filter = "blur(0px)";
}
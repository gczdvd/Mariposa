
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    let j;
    let slides = document.getElementsByClassName("questions");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length){
      slideIndex = 1;
    }

    if (n < 1){
      slideIndex = slides.length;
    }
    for (j = 0; j < slides.length; j++) {
      slides[j].style.display = "none";
    }

    for (j = 0; j < dots.length; j++) {
      dots[j].className = dots[j].className.replace("active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += "active";
}



// Animált accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle(" active");
    var panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

  });
}
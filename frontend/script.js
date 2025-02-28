function colorChange(textarea){
  if(textarea.value.length == 0){
    textarea.style.borderColor = "#d3d3d3";
  }
  else{
    textarea.style.borderColor = "#ffbc2f";
  }
}

// belekattintasz, narancssárga
// beleírsz narancssárga
// ha van tartalma, és kilépsz, narancssárga
// ha nincs tartalma, és kilépsz, szürke

Backend.get({
    path:"/userinfo",
    blockRedirect: false,
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").getElementsByTagName("img")[0].src = e.profile_pic;
        }
    }
});
function colorChange(textarea){
  if(textarea.value.length == 0){
    textarea.style.borderColor = "#d3d3d3";
  }
  else{
    textarea.style.borderColor = "#ffbc2f";
  }
}


Backend.get({
    path:"/userinfo",
    blockRedirect: false,
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").style.backgroundImage = `url('${e.profile_pic}')`;
        }
    }
});
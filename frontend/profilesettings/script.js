// const textarea = document.getElementById("textarea");

Backend.get({
    path:"/userinfo",
    callback:(e)=>{
        console.log(e);
        if(e.profile_pic){
            document.getElementById("profilePicture").src = e.profile_pic;
        }
        if(e.nickname){
            document.getElementById("nickname").innerHTML = e.nickname;
        }
        if(e.description){
            document.getElementById("textarea").value = e.description;
        }
    }
});

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

function checkDateValid(ye, me, de, fail, ok){
    ok(ye);
    ok(me);
    ok(de);
    const twodig = (num)=>{
        return String(num < 10 ? '0' : '') + String(num);
    }
    var molen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var year = ye.value;
    var month = me.value;
    var day = de.value;
    if(!Number(year) || year < 1900){
        fail(ye);
        return null;
    }
    if((year % 4 == 0) && (!(year % 100 == 0) || (year % 400 == 0))){
        molen[1] = 29;
    }
    if(!Number(month) || month > 12 || month < 1){
        fail(me);
        return null;
    }
    if(!Number(day) || day > molen[month-1] || day < 1){
        fail(de);
        return null;
    }
    var wrodate = `${year}-${twodig(month)}-${twodig(day)}`;
    if((new Date()) <= (new Date(wrodate))){
        fail(ye);
        fail(me);
        fail(de);
        return null;
    }
    
    return wrodate;
}

function dateWatcher(){
    document.getElementById("ageDiv").setAttribute("value", checkDateValid(document.getElementById("year"), document.getElementById("month"), document.getElementById("day"),
        (e)=>{
            e.style.backgroundColor = "red";
        },
        (e)=>{
            e.style.backgroundColor = "var(--bs-body-bg)";
        }
    ));
}

// ha van kiválasztva érdeklődési kör, a felette lévő cím színe narancssárga legyen
// ciklussal végigmegyünk az összes details-en - külső ciklus
// belső ciklus: éppen aktuális details-eken belül lévő összes button-ön végigmegyünk
// valamelyiknek a classa selected-e
// ha igen: éppen kiválasztott details style color narancs
// ha nem: éppen kiválasztott details style color fekete

// mentés gomb elküldi az adatokat, visszajön a válasz, ha sikeres, akkor sikeresen mentésre kerültek, ha nem, akkor szerverhiba
function saveData(){
  var success = true;
  // var success = true;

    var newdat = {
        birthdate:null,
        description:null,
        email:"hadopilolya@gmail.com",
        gender:null,
        id:54,
        nickname:"Hadopi",
        profile_pic:"/api/storage/profile_pic/1efe2193-fd8f-6e60-89c7-261a7059cbed.png",
        topics:[]
    };

    var sels = document.getElementsByClassName("selected");
    for(var i = 0; i < sels.length; i++){
        newdat.topics.push(sels[i].getAttribute("value"));
    };


    Backend.post({
        path:"/profilemodify",
        body:{
            //password
            gender:undefined,
            description:document.getElementById("textarea").value,
            profile_pic:undefined,
            topics:undefined
        },
        callback:console.log
    })
  if(document.getElementById("profilepicup").files.length > 0){
        var f = new FormData();
        f.append("file", document.getElementById("profilepicup").files[0]);

        Backend.post({
            path:"/profilepic",
            body:f,
            callback:console.log
        });
    }

  if(success){
    Swal.fire({
      icon: "success",
      title: "Az adatok sikeresen mentésre kerültek!",
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

Backend.get({
    path:"/userinfo",
    callback:(e)=>{
        if(e.id != undefined){
            document.getElementById("optlogin").setAttribute("hidden", "true");
            document.getElementById("optprofile").removeAttribute("hidden");
            document.getElementById("optprofile").getElementsByTagName("img")[0].src = e.profile_pic;
        }
    }
});
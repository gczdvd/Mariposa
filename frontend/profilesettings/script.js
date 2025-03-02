// const textarea = document.getElementById("textarea");

Backend.get({
    path:"/userinfo",
    callback:(e)=>{
        console.log(e);

        // if(e.id != undefined){
        //     document.getElementById("optlogin").setAttribute("hidden", "true");
        //     document.getElementById("optprofile").removeAttribute("hidden");
        //     document.getElementById("optprofile").style.backgroundImage = `url('${e.profile_pic}')`;
        // 

        if(e.nickname){
            document.getElementById("username").value = e.nickname;
            document.getElementById("username").style.borderColor = "#ffbc2f";
            document.getElementById("nickname").innerHTML = e.nickname;
        }
        if(e.email){
            document.getElementById("email").value = e.email;
            document.getElementById("email").style.borderColor = "#ffbc2f";
        }
        if(e.gender){
            document.getElementById("gender").value = e.gender;
            document.getElementById("gender").style.borderColor = "#ffbc2f";
        }
        if(e.profile_pic){
            document.getElementById("profilePicture").style.backgroundImage = `url('${e.profile_pic}')`;
        }
        if(e.description){
            document.getElementById("textarea").value = e.description;
            document.getElementById("textarea").style.borderColor = "#ffbc2f";
        }
        if(e.birthdate){
            var bd = new Date(e.birthdate);
            document.getElementById("year").value = bd.getUTCFullYear();
            document.getElementById("month").value = (bd.getMonth()+1);
            document.getElementById("day").value = bd.getDate();
        }
    }
});

function logout(){
    Backend.get({
        path:"/logout"
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

function picup(e){
    var fr = new FileReader();
    fr.onload = function () {
        document.getElementById("profilePicture").style.backgroundImage = `url('${fr.result}')`;
    }
    fr.readAsDataURL(e.files[0]);
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
    return checkDateValid(document.getElementById("year"), document.getElementById("month"), document.getElementById("day"),
        (e)=>{
            e.style.borderColor = "red";
        },
        (e)=>{
            e.style.borderColor = "#ffbc2f";
        }
    );
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

    // var newdat = {
    //     birthdate:null,
    //     description:null,
    //     email:"hadopilolya@gmail.com",
    //     gender:null,
    //     id:54,
    //     nickname:"Hadopi",
    //     profile_pic:"/api/storage/profile_pic/1efe2193-fd8f-6e60-89c7-261a7059cbed.png",
    //     topics:[]
    // };

    // var sels = document.getElementsByClassName("selected");
    // for(var i = 0; i < sels.length; i++){
    //     newdat.topics.push(sels[i].getAttribute("value"));
    // };

    Backend.post({
        path:"/profilemodify",
        body:{
            //password
            birthdate:dateWatcher(),
            gender:document.getElementById("gender").value,
            description:document.getElementById("textarea").value,
            nickname:document.getElementById("username").value,
            topics:undefined
        },
        callback: (e) => {
            if(e.message == "Successful modified."){
                Swal.fire({
                    icon: "success",
                    title: "Az adatok sikeresen mentésre kerültek!",
                    width: "64em",
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonText: "Rendben!",
                    confirmButtonColor: "#ffbc2f",
                    iconColor: "#ffbc2f"
                }).then((result) =>{
                    if(result.isConfirmed){
                        // window.location.hash = "#top";
                        setTimeout(() => {
                            window.location.href = "#top";
                        }, 250);
                        
                    }
                });
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Az adatok mentése során hibába ütköztünk!",
                    text: "Kérjük, próbáld meg később!",
                    width: "64em",
                    confirmButtonText: "Bezárás",
                    confirmButtonColor: "#545454",
                    iconColor: "#ffbc2f"
                });
            }
        }
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
}

function deleteAccount(){
    fetch("/words/hu.txt").then((e)=>{
        e.text().then((f)=>{
            var words = f.split('\r\n');
            var word = words[Math.floor(Math.random() * words.length)];
            Swal.fire({
                title: "Írd vissza",
                text: word,
                input: "text",
                showCancelButton: true
            }).then((g)=>{
                if(g.isConfirmed && g.value == word){
                    console.log("Fiók törlése");
                    Backend.get({
                        "path":"/deleteprofile"
                    })
                }
            });
        });
    });
    
}

fetch("/interests.json").then((e)=>{
    e.json().then((f)=>{
        interestsDiv = document.getElementsByClassName("interests")[0];
        var intrestGroups = Object.keys(f);
        for(var i = 0; i < intrestGroups.length; i++){
            var interestGroupDiv = document.createElement("div");
            interestGroupDiv.classList.add(intrestGroups[i].toLowerCase());
            interestGroupDiv.id = intrestGroups[i].toLowerCase();

            var titleP = document.createElement("p");
            titleP.innerText = f[intrestGroups[i]].name;
            interestGroupDiv.appendChild(titleP);

            var subIntrests = Object.keys(f[intrestGroups[i]].data);
            for(var j = 0; j < subIntrests.length; j++){
                var interestButton = document.createElement("button");
                interestButton.setAttribute("value", subIntrests[j]);
                interestButton.setAttribute("onclick", "chosenInterest(this)");
                interestButton.classList.add("notSelected");

                var emojiSpan = document.createElement("span");
                emojiSpan.classList.add("emoji");
                emojiSpan.innerHTML = f[intrestGroups[i]].data[subIntrests[j]].emoji;

                interestButton.appendChild(emojiSpan);
                interestButton.innerHTML += (" " + f[intrestGroups[i]].data[subIntrests[j]].name);

                interestGroupDiv.appendChild(interestButton);
            }

            interestsDiv.appendChild(interestGroupDiv);
        }
    });
});
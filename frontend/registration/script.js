function togglePSW() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById("toggleIcon").innerHTML = "👁️";
      
    } else {
      x.type = "password";
      document.getElementById("toggleIcon").innerHTML = "🕳️";
    }
}

function registration(){
    var email = document.getElementById("email").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password").value;

    fetch("http://127.0.0.1:3000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email:email,
            birthdate:"2015-05-07",
            nickname:nickname,
            password:password,
            gender:0,
            comment:"Hello, World!"
        }) 
    })
    .then((e)=>{
        e.json().then((j)=>{
            console.log(j);
        });
    });
}
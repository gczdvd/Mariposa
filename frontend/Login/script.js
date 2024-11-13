function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email, 
            password: password
        }) 
    })
    .then(async (e)=>{
        var resp = await e.json();
    });
}
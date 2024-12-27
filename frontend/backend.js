var rootAddr = "asdsad";
class Backend{
    static setUrl(url){
        rootAddr = url;
    }
    static url(){
        return rootAddr;
    }
    static get(params) {
        fetch("http://" + rootAddr + params.path, {
            method: "GET",
            credentials: "include"
        })
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            if(resp.action == "redirect"){
                window.location.href = resp.value;
            }
            else{
                params?.callback(resp);
            }
        });
    }
    static post(params) {
        fetch("http://" + rootAddr + params.path, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(params?.body ?? {}) 
        })
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            if(resp.action == "redirect"){
                window.location.href = resp.value;
            }
            else{
                params?.callback(resp);
            }
        });
    }
    static info(){
        var kvp = {};
        document.cookie.split(';').forEach((v, i)=>{
            var tmp = v.trim().split('=');
            tmp[1] = decodeURIComponent(tmp[1]);
            try{
                tmp[1] = JSON.parse(tmp[1]);
            }
            catch(e){}
            kvp[tmp[0]] = tmp[1];
        });
        return kvp?.info ? kvp.info : kvp;
    }
}
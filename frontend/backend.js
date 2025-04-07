var rootAddr = "mariposachat.hu/api";
const debug = false;
class Backend{
    static responsePreprocessor(requestParams, backendResponse){
        if(requestParams.blockRedirect == undefined && backendResponse.action == "redirect"){
            if(debug) alert(JSON.stringify(backendResponse));
            window.location.href = backendResponse.value;
        }
        else if(requestParams.blockReload == undefined && backendResponse.action == "reload"){
            window.location.reload();
        }
        else{
            return true;
        }
        return false;
    }
    static setUrl(url){
        //rootAddr = url;
    }
    static url(){
        return rootAddr;
    }
    static get(params) {
        fetch("https://" + rootAddr + params.path, {
            method: "GET",
            credentials: "include",
            keepalive:true
        })
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            if(Backend.responsePreprocessor(params, resp)){
                params?.callback(resp);
            }
        });
    }
    static post(params) {
        var req;
        if(params?.body?.constructor?.name == "FormData"){
            req = {
                method: "POST",
                credentials: "include",
                body: params?.body,
                keepalive:true
            }
        }
        else{
            req = {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(params?.body ?? {}),
                keepalive:true
            }
        }

        fetch("https://" + rootAddr + params.path, req)
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            
            if(Backend.responsePreprocessor(params, resp)){
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
var rootAddr = "mariposachat.hu/api";
const debug = false;
class Backend{
    static setUrl(url){
        //rootAddr = url;
    }
    static url(){
        return rootAddr;
    }
    static get(params) {
        fetch("https://" + rootAddr + params.path, {
            method: "GET",
            credentials: "include"
        })
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            if(params.blockRedirect == undefined && resp.action == "redirect"){
                if(debug) alert(JSON.stringify(resp));
                window.location.href = resp.value;
            }
            else{
                params?.callback(resp);
            }
        });
    }
    static async asyncGet(params){
        var a = await fetch("https://" + rootAddr + params.path, {
            method: "GET",
            credentials: "include"
        });
        var resp = await a.json();
        if(params.blockRedirect == undefined && resp.action == "redirect"){
            if(debug) alert(JSON.stringify(resp));
            window.location.href = resp.value;
            return null;
        }
        else{
            return resp;
        }
    }
    static post(params) {
        var req;
        if(params?.body?.constructor?.name == "FormData"){
            req = {
                method: "POST",
                credentials: "include",
                body: params?.body
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
                body: JSON.stringify(params?.body ?? {})
            }
        }

        fetch("https://" + rootAddr + params.path, req)
        .then(async (e)=>{
            var resp = await e.json();
            // alert(JSON.stringify(params));
            // alert(JSON.stringify(resp));
            if(params.blockRedirect == undefined && resp.action == "redirect"){
                if(debug) alert(JSON.stringify(resp));
                window.location.href = resp.value;
            }
            else{
                params?.callback(resp);
            }
        });
    }
    static async asyncPost(params){
        var req;
        if(params?.body?.constructor?.name == "FormData"){
            req = {
                method: "POST",
                credentials: "include",
                body: params?.body
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
                body: JSON.stringify(params?.body ?? {})
            }
        }

        var a = await fetch("https://" + rootAddr + params.path, req);
        var resp = await a.json();
        // alert(JSON.stringify(params));
        // alert(JSON.stringify(resp));
        if(params.blockRedirect == undefined && resp.action == "redirect"){
            if(debug) alert(JSON.stringify(resp));
            window.location.href = resp.value;
            return null;
        }
        else{
            return resp;
        }
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
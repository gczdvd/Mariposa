"use strict";

export class Chats{
    #chats = [];
    constructor(db){
        this.db = db;
    }
    getChats(){
        return this.#chats;
    }
    newChat(sess1, sess2, secondchid=false){
        const ch = new Chat(this.db, sess1, sess2, secondchid);
        var haschat = this.findChatById(ch.getId());
        if(haschat != null){
            return haschat;
        }
        else{
            this.#chats.push(ch);
            return ch;
        }
    }
    findChatById(id){
        for(var i = 0; i < this.#chats.length; i++){
            if(this.#chats[i].getId() == id){
                return this.#chats[i];
            }
        }
        return null;
    }
    getChatById(id){    //EZMINEK
        for(var i = 0; i < this.#chats.length; i++){
            if(this.#chats[i].getId() == id){
                return this.#chats[i];
            }
        }
        return false;
    }
}

export class Chat{
    #sess1 = null;
    #sess2 = null;
    saved = null;
    #wantsave = [false, false];
    constructor(db, sess1=null, sess2=null, secondchid=false){
        this.db = db;
        this.#sess1 = sess1;
        if(secondchid == false){
            var cid1 = sess1?.getAttribute("client")?.getId();
            var cid2 = sess2?.getAttribute("client")?.getId();

            this.#sess2 = sess2;
            var chattr = this.db.getChat(cid1, cid2);
            this.id = chattr.id;
            this.saved = chattr.persistent;
        }
        else{
            this.id = sess2;
        }
    }
    setSaved(){
        if(this.db.setChatPersistent(this.id, 1)){
            this.saved = 1;
            return true;
        }
        else{
            return false;
        }
    }
    wantToPersistent(sess){
        if(this.saved != 1){
            switch(sess){
                case(this.#sess1):{
                    this.#wantsave[0] = true;
                    break;
                }
                
                case (this.#sess2):{
                    this.#wantsave[1] = true;
                    break;
                }
            }
            if(this.#wantsave[1] && this.#wantsave[0]){
                if(this.setSaved()){
                    this.#sess1.getWebsocket()?.send(JSON.stringify({
                        "type":"action",
                        "name":"identify",
                        "value":this.#sess2.getAttribute("client").getInfo()
                    }));
                    this.#sess2.getWebsocket()?.send(JSON.stringify({
                        "type":"action",
                        "name":"identify",
                        "value":this.#sess1.getAttribute("client").getInfo()
                    }));
                    return true;
                }
                else{
                    return false; 
                }
            }
            else{
                return false;
            }
        }
    }
    setUser(sess){
        if(this.#sess1?.getAttribute("client").getId() == sess.getAttribute("client").getId()){ //EZ NAGGYONNEMJÓ
            this.#sess1 = sess;
        }
        else{
            this.#sess2 = sess;
        }
    }
    leftUser(sess){
        if(this.#sess1?.getAttribute("client").getId() == sess.getAttribute("client").getId()){
            this.#sess1 = null;
        }
        else if(this.#sess2?.getAttribute("client").getId() == sess.getAttribute("client").getId()){
            this.#sess2 = null;
        }
    }
    getId(){
        return this.id;
    }
    close(){
        this.#sess1?.setAttribute("chat", null);
        this.#sess2?.setAttribute("chat", null);

        /*me.getWebsocket().send(JSON.stringify({
                "status":"end"
        }));*/
    }
    getMessages(){
        return this.db.getMessages(this.id, 0);
    }
    getPartner(me){
        return (me === this.#sess1) ? this.#sess2 : this.#sess1;
    }
    newMessage(me, message, type){
        this.db.newMessage(me.getAttribute("client").getId(), message, type, this.id);

        var partner = this.getPartner(me);
        
        partner?.getWebsocket()?.send(JSON.stringify({
            "from":1,
            "type":type,
            "message":message
        }));

        me?.getWebsocket()?.send(JSON.stringify({
            "from":0,
            "type":type,
            "message":message
        }));
    }
}

/*export class Chat{
    constructor(db, sess1, sess2){
        this.db = db;
        this.sess1 = sess1;
        this.sess2 = sess2;
        this.cid1 = sess1.getAttribute("client").getId();
        this.cid2 = sess2.getAttribute("client").getId();
        this.id = this.db.getChat(this.cid1, this.cid2);
    }
    getId(){
        return this.id;
    }
    close(){
        this.sess1.getWebsocket()?.close();
        this.sess2.getWebsocket()?.close();
        this.sess1.setAttribute("chat", null);
        this.sess2.setAttribute("chat", null);
    }
    getMessages(){
        return this.db.getMessages(this.getId());
    }
    getPartner(me){
        return (me == this.sess1) ? this.sess2 : this.sess1;
    }
    newMessage(sess, message, type){
        this.db.newMessage(sess.getAttribute("client").getId(), message, type, this.id);

        var partner = (sess == this.sess1) ? this.sess2 : this.sess1;
        var me = sess;

        var pawe = partner.getWebsocket();
        console.log(pawe);
        if(pawe != null){
            partner.getWebsocket().send(JSON.stringify({
                "from":1,
                "type":type,
                "message":message
            }));
            me.getWebsocket().send(JSON.stringify({
                "from":0,
                "type":type,
                "message":message
            }));
        }
        else{
            me.getWebsocket().send(JSON.stringify({
                "status":"end"
            }))
            me.getWebsocket().close();
            me.setAttribute("chat", null);
            partner.setAttribute("chat", null);
        }
    }
}*/

export class Want{
    constructor(){}
}

export class Finder{
    constructor(sessions, chats, autocheck=true){
        this.sessions = sessions;
        this.chats = chats;
        if(autocheck){
            setInterval(()=>{
                this.check();
            }, 1000);
        }
    }
    check(){
        var sesss = this.sessions.getSessions();
        var pair = [];
        for(var i = 0; i < sesss.length; i++){
            if(sesss[i].getAttribute("chat") instanceof Want){
                pair.push(sesss[i]);
                if(pair.length == 2){
                    //IÁÁÁ
                    const nChat = this.chats.newChat(pair[0], pair[1]);
                    pair[0].setAttribute("chat", nChat);
                    pair[1].setAttribute("chat", nChat);
                    pair[0].getWebsocket()?.send(JSON.stringify({
                        "status":"havepartner"
                    }));
                    pair[1].getWebsocket()?.send(JSON.stringify({
                        "status":"havepartner"
                    }));

                    break;
                }
            }
        }
    }
}
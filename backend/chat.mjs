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
            this.#sess2 = sess2;

            this.cid1 = sess1?.getAttribute("client")?.getId();
            this.cid2 = sess2?.getAttribute("client")?.getId();

            var chattr = this.db.getChat(this.cid1, this.cid2);
            this.id = chattr.id;
            this.saved = chattr.persistent;
        }
        else{
            var chattr = this.db.getChatById(sess2);
            this.id = chattr.id;
            this.saved = chattr.persistent;
            if(sess1.getAttribute("client").getId() == chattr.client1_id){
                this.cid1 = chattr.client1_id;
                this.cid2 = chattr.client2_id;
            }
            else{
                this.cid1 = chattr.client2_id;
                this.cid2 = chattr.client1_id;
            }
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
    getSaved(){
        return this.saved;
    }
    sendIdentity(users){
        this.#sess1?.getWebsocket()?.send(JSON.stringify({
            "type":"action",
            "name":"identify",
            "value":users.getUserById(this.cid2).getInfo()
        }));
        this.#sess2?.getWebsocket()?.send(JSON.stringify({
            "type":"action",
            "name":"identify",
            "value":users.getUserById(this.cid1).getInfo()
        }));
    }
    wantToPersistent(sess){
        if(this.saved != 1){
            switch(sess){
                case (this.#sess1):{
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
                    this.sendIdentity();
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
        if(this.cid1 == sess.getAttribute("client").getId()){
            this.#sess1 = sess;
        }
        if(this.cid2 == sess.getAttribute("client").getId()){
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

export class Want{
    constructor(){}
}

export class Finder{
    constructor(sessions, chats, db, autocheck=true){
        this.sessions = sessions;
        this.chats = chats;
        this.db = db;
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
                    var tmpChat = new Chat(this.db, pair[0], pair[1])
                    var nChat = this.chats.findChatById(tmpChat.getId());
                    if(nChat == null){
                        nChat = this.chats.newChat(pair[0], pair[1]);
                    }
                    else{
                        nChat.setUser(pair[0]);
                        nChat.setUser(pair[1]);
                    }

                    pair[0].setAttribute("chat", nChat);
                    pair[1].setAttribute("chat", nChat);
                    pair[0].getWebsocket()?.send(JSON.stringify({
                        "type":"action",
                        "name":"havepartner",
                        "value":null
                    }));
                    pair[1].getWebsocket()?.send(JSON.stringify({
                        "type":"action",
                        "name":"havepartner",
                        "value":null
                    }));

                    break;
                }
            }
        }
    }
}
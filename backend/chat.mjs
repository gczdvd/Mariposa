"use strict";

export class Chats{
    #chats = [];
    constructor(db, users){
        this.db = db;
        this.users = users;
    }
    cleanUp(){
        for(var i = 0; i < this.#chats.length; i++){
            if(this.#chats[i].dead()){
                this.#chats.splice(i, 1);
            }
        }
    }
    getChats(){
        return this.#chats;
    }
    newChat(sess1, sess2, secondchid=false){
        const ch = new Chat(this.db, this.users, sess1, sess2, secondchid);
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
    constructor(db, users, sess1=null, sess2=null, secondchid=false){
        this.users = users;
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
    setSaved(val=1){
        this.saved = val;
        this.#wantsave = [val, val];
        return this.db.setChatPersistent(this.id, val);
    }
    dead(){
        return (this.#sess1 == null && this.#sess2 == null);
    }
    getSaved(){
        return this.saved;
    }
    sendIdentity(){
        var u1dat = this.db.getUserDataById(this.cid1);
        var u2dat = this.db.getUserDataById(this.cid2);
        
        u1dat.saved = this.getSaved();
        u2dat.saved = this.getSaved();

        const genders = ["???", "Nő", "Férfi", "Nembináris"];

        u1dat.gender = genders[u1dat.gender ?? 0];
        u2dat.gender = genders[u2dat.gender ?? 0];

        if(this.getSaved()){
            this.#sess1?.getAttribute("access").add('storage/profile_pic/' + u2dat.profile_pic);
            this.#sess2?.getAttribute("access").add('storage/profile_pic/' + u1dat.profile_pic);
            
            u1dat.profile_pic = "/api/storage/profile_pic/" + u1dat.profile_pic;
            u2dat.profile_pic = "/api/storage/profile_pic/" + u2dat.profile_pic;

            this.#sess1?.getWebsocket()?.send(JSON.stringify({
                "type":"action",
                "name":"identify",
                "value":u2dat
            }));

            this.#sess2?.getWebsocket()?.send(JSON.stringify({
                "type":"action",
                "name":"identify",
                "value":u1dat
            }));
        }
        else{
            this.#sess1?.getWebsocket()?.send(JSON.stringify({
                "type":"action",
                "name":"identify",
                "value":{
                    "saved":u2dat.saved,
                    "birthdate":u2dat.birthdate,
                    "gender":u2dat.gender,
                    "description":u2dat.description
                }
            }));

            this.#sess2?.getWebsocket()?.send(JSON.stringify({
                "type":"action",
                "name":"identify",
                "value":{
                    "saved":u1dat.saved,
                    "birthdate":u1dat.birthdate,
                    "gender":u1dat.gender,
                    "description":u1dat.description
                }
            }));
        }
    }
    wantToPersistent(sess, users){
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
                    this.sendIdentity(users);
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
        else{
            return true;
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
        sess.setAttribute("chat", undefined);

        if(!this.getSaved()){
            this.end();
        }
    }
    getId(){
        return this.id;
    }
    end(){
        this.setSaved(0);
        this.#sess1?.getWebsocket()?.send(JSON.stringify({
            "status":"end"
        }));
        this.#sess2?.getWebsocket()?.send(JSON.stringify({
            "status":"end"
        }));
        this.#sess1?.setAttribute("chat", undefined);
        this.#sess2?.setAttribute("chat", undefined);
        this.#sess1 = null;
        this.#sess2 = null;
        this.id = -1;
    }
    getMessages(from=null){
        return this.db.getMessages(this.id, from);
    }
    getPartner(me){
        return (me === this.#sess1) ? this.#sess2 : this.#sess1;
    }
    getPartnerByCid(me){
        return (me === this.cid1) ? this.cid2 : this.cid1;
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
    constructor(db, sess){
        var userid = sess.getAttribute("client").getId();
        this.partners = db.getSavedChatsByUserId(userid);
    }
    getPartners(){
        return this.partners;
    }
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
        for(var i = 0; i < sesss.length; i++){
            if(sesss[i].getAttribute("chat") instanceof Want){
                for(var j = 0; j < sesss.length; j++){
                    if(i != j && sesss[j].getAttribute("chat") instanceof Want){
                        var first_user_id = sesss[i].getAttribute("client").getId();
                        var second_user_partners = sesss[j].getAttribute("chat").getPartners();

                        var is_partners = false;
                        for(var k = 0; k < second_user_partners.length; k++){
                            if(second_user_partners[k].user_id == first_user_id){
                                is_partners = true;
                                break;
                            }
                        }

                        if(!is_partners){
                            var nChat = this.chats.newChat(sesss[i], sesss[j]);

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
    }
}
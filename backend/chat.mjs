"use strict";

export class Chats{
    #chats = [];
    constructor(db){
        this.db = db;
    }
    newChat(sess1, sess2){
        const ch = new Chat(this.db, sess1, sess2);
        this.#chats.push(ch);
        return ch;
    }
    getChatById(id){
        for(var i = 0; i < this.#chats.length; i++){
            if(this.#chats[i].getId() == id){
                return this.#chats[i];
            }
        }
        return false;
    }
}

export class Chat{
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
}

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
                    const nChat = this.chats.newChat(pair[0], pair[1]);
                    pair[0].setAttribute("chat", nChat);
                    pair[1].setAttribute("chat", nChat);
                    pair[0].getWebsocket()?.send(JSON.stringify({
                        "status":"havepartner",
                        "identify":pair[1].getAttribute("client").getInfo()
                    }));
                    pair[1].getWebsocket()?.send(JSON.stringify({
                        "status":"havepartner",
                        "identify":pair[0].getAttribute("client").getInfo()
                    }));
                    
                    var e = nChat.getMessages();
                    for(var i = 0; i < e.length; i++){
                        var pers = (e[i].client_id == pair[0].getAttribute("client").getId());
                        pair[0].getWebsocket().send(JSON.stringify({
                            "from":pers ? 0 : 1,
                            "type":e[i].content_type,
                            "message":e[i].message_value
                        }));
                        pair[1].getWebsocket().send(JSON.stringify({
                            "from":pers ? 1 : 0,
                            "type":e[i].content_type,
                            "message":e[i].message_value
                        }));
                    }
                    break;
                }
            }
        }
    }
}
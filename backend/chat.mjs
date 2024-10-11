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
        this.db.getChat(this.cid1, this.cid2, (id)=>{//GETCHAT, HA LÉTEZIK olyan ahol ugyanazok a userek vannak, AKKOR AZT ADJA VISSZA, ne csináljon újat
            this.id = id;
        });
    }
    getId(){
        return this.id;
    }
    newMessage(sess, message, type){
        this.db.newMessage(sess.getAttribute("client").getId(), message, type, this.id);
        if(sess == this.sess1){
            var partner = this.sess2;
        }
        else{       //Szebbre
            var partner = this.sess1;
        }
        partner.getAttribute("websocket").send(JSON.stringify({ //Ez nem küld
            "type":type,
            "message":message
        }));
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
                    pair[0].getAttribute("websocket").send(JSON.stringify({
                        "status":"havepartner"
                    }));
                    pair[1].getAttribute("websocket").send(JSON.stringify({
                        "status":"havepartner"
                    }));
                    break;
                }
            }
        }
    }
}
"use strict";

export class Chats{
    #chats = [];
    constructor(db){
        this.db = db;
    }
    newChat(cid1, cid2){
        const ch = new Chat(this.db, cid1, cid2);
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
    constructor(db, cid1, cid2){
        this.db = db;
        this.cid1 = cid1;
        this.cid2 = cid2;
        this.db.getChat(cid1, cid2, (id)=>{//GETCHAT, HA LÉTEZIK olyan ahol ugyanazok a userek vannak, AKKOR AZT ADJA VISSZA, ne csináljon újat
            this.id = id;
        });
    }
    getId(){
        return this.id;
    }
    newMessage(cid, message, type){
        this.db.newMessage(cid, message, type, this.id);
    }
}

export class Want{
    constructor(){

    }
}
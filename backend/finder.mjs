"use strict";

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
            if(sesss[i].getAttribute("chat") == "waiting"){
                pair.push(sesss[i]);
                if(pair.length == 2){
                    const nChat = this.chats.newChat(pair[0].getAttribute("client").getId(), pair[1].getAttribute("client").getId());
                    pair[0].setAttribute("chat", nChat);
                    pair[1].setAttribute("chat", nChat);
                    break;
                }
            }
        }
    }
}
'use strict';

import md5 from '/root/Mariposa/backend/node_modules/md5/md5.js';
import { v4 as uuid } from '/root/Mariposa/backend/node_modules/uuid/dist/esm/index.js';
import websocket from '/root/Mariposa/backend/node_modules/express-ws/index.js';

export class Sessions{
    constructor(maxAge){
        this.maxAge = maxAge;
        this.sessions = [];
    }
    getSessions(){
        return this.sessions;
    }
    genId(){
        do{
            var testId = md5(uuid()) + md5(new Date(Date.now()).getTime());
            var trySess = this.getSessionById(testId);
        }
        while(trySess != null);
        return testId;
    }
    removeSession(session){
        for(var i = 0; i < this.sessions.length; i++){
            if(this.sessions[i] == session){
                this.sessions[i].killWebsocket();
                this.sessions.splice(i);
                return true;
            }
        }
        return false;
    }
    newSession(){
        var sess = new Session(this.genId(), this.maxAge);
        this.sessions.push(sess);
        return sess;
    }
    addSession(session){
        this.sessions.push(session);
    }
    getSessionById(id){
        for(var i = 0; i < this.sessions.length; i++){
            if(this.sessions[i].getId() == id){
                return this.sessions[i];
            }
        }
        return null;
    }
    cleanUp(){
        for(var i = 0; i < this.sessions.length; i++){
            if(!this.sessions[i].valid()){
                this.removeSession(this.sessions[i]);
            }
        }
    }
}

export class Session{
    static neverExpire(){
        return new Date(Date.now() + 34560000000);
    }
    constructor(id, maxAge){
        this.maxAge = maxAge;
        this.id = id;
        this.attributes = {};
        this.websocket = null; 
        this.touch();

        setInterval((self=this)=>{
            if(self.websocket?.readyState == 3){
                self.killWebsocket();
            }
        }, 1000);

        return id;
    }
    valid(){
        return (new Date(Date.now()).getTime() < this.getExpire().getTime());
    }
    touch(maxAge=null){
        var mxage = maxAge ? maxAge : this.maxAge;
        this.expire = new Date(Date.now() + mxage).getTime();
        return this.id;
    }
    getExpire(){
        return new Date(this.expire);
    }
    getId(){
        return this.id;
    }
    setWebsocket(ws){
        this.websocket = ws;
    }
    getWebsocket(){
        return this.websocket;
    }
    killWebsocket(){
        this.websocket?.close();
        this.websocket = null;
    }
    setAttribute(name, value){
        this.attributes[name] = value;
    }
    getAttribute(name){
        return this.attributes[name];
    }
}
'use strict';

import md5 from 'md5';
import { v4 as uuid } from 'uuid';

export class Sessions{
    constructor(){
        this.sessions = [];
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
                this.sessions.splice(i);
                return true;
            }
        }
        return false;
    }
    newSession(){
        var sess = new Session(this.genId(), 120000);
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
}

export class Session{
    static neverExpire(){
        return new Date(Date.now() + 34560000000);
    }
    constructor(id, maxAge){
        this.maxAge = maxAge;
        this.id = id;
        this.attributes = {};
        this.touch();

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
    setAttribute(name, value){
        this.attributes[name] = value;
    }
    getAttribute(name){
        return this.attributes[name];
    }
}
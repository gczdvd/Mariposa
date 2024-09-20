'use strict';

import md5 from 'md5';
import { v4 as uuid } from 'uuid';

export class Sessions{
    constructor(){
        this.sessions = [];
    }
    newSession(){
        var sess = new Session(uuid(), 10000);
        this.sessions.push(sess);
        return sess;
    }
    addSession(session){
        this.sessions.push(session);
    }
    getSessionByToken(token){
        for(var i = 0; i < this.sessions.length; i++){
            if(this.sessions[i].getToken() == token){
                return this.sessions[i];
            }
        }
        return null;
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
    constructor(id, maxAge){
        this.maxAge = maxAge;
        this.id = id;
        this.token = this.#hash(id, maxAge);
        this.attributes = {};
        return id;
    }
    #hash(id, maxAge){
        var expire = new Date(Date.now() + maxAge).getTime();
        this.expire = expire;
        return md5(id + expire);
    }
    valid(){
        return (new Date(Date.now()).getTime() < this.getExpire().getTime());
    }
    touch(maxAge=null){
        if(maxAge == null){
            this.token = this.#hash(this.id, this.maxAge);
        }
        else{
            this.token = this.#hash(this.id, maxAge);
        }
        return this.token;
    }
    getExpire(){
        return new Date(this.expire);
    }
    getId(){
        return this.id;
    }
    getToken(){
        return this.token;
    }
    setAttribute(name, value){
        this.attributes[name] = value;
    }
}
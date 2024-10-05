"use strict";

export class User{
    constructor(id, nickname, birthdate, email, topic){
        this.id = id;
        this.nickname = nickname;
        this.birthdate = birthdate;
        this.email = email;
        this.topic = topic;
    }

    getNickname(){
        return this.nickname;
    }

    getEmail(){
        return this.email;
    }

    getId(){
        return this.id;
    }
}

export class Guest{
    constructor(id){
        this.id = id;
    }

    getId(){
        return this.id;
    }
}
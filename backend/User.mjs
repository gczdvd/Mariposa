"use strict";

export class User{
    constructor(id, username, birthdate, email, topic){
        this.id = id;
        this.username = username;
        this.birthdate = birthdate;
        this.email = email;
        this.topic = topic;
    }

    getUsername(){
        return this.username;
    }
}
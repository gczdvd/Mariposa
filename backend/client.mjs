"use strict";

import fs from 'fs';

export class Users{
    #users = [];
    constructor(db){
        this.db = db;
    }
    getUsers(){
        return this.#users;
    }
    getUserById(id){
        for(var i = 0; i < this.#users.length; i++){
            if(this.#users[i].getId() == id){
                return this.#users[i];
            }
        }
        var u = this.db.getUserById(id, this.db);
        this.#users.push(u);
        return u;
    }
}

export class User{
    constructor(id, db){
        this.id = id;
        this.db = db;
        // this.nickname = nickname;
        // this.birthdate = birthdate;
        // this.email = email;
        // this.topics = JSON.parse(topics);
        // this.gender = gender;
        // this.description = description;
        // this.profile_pic = profile_pic;
    }

    getNickname(){
        return this.getInfo().nickname;
    }

    getEmail(){
        return this.getInfo().email;
    }

    getId(){
        return this.id;
    }

    getInfo(){
        var tmp = this.db.getUserDataById(this.id);
        tmp.profile_pic = "/api/storage/profile_pic/" + tmp.profile_pic;
        return tmp;
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
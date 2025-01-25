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
        var u = this.db.getUserById(id);
        this.#users.push(u);
        return u;
    }
}

export class User{
    constructor(id, nickname, birthdate, email, topics, gender, description, profile_pic){
        this.id = id;
        this.nickname = nickname;
        this.birthdate = birthdate;
        this.email = email;
        this.topics = JSON.parse(topics);
        this.gender = gender;
        this.description = description;
        this.profile_pic = profile_pic;
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

    getInfo(){
        return JSON.stringify({
            "id":this.id,
            "nickname":this.nickname,
            "birthdate":this.birthdate,
            "email":this.email,
            "topics":this.topics,
            "gender":this.gender,
            "description":this.description,
            "profile_pic":"/api/storage/profile_pic/" + this.profile_pic
        });
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
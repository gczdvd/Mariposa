"use strict";

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
            "profile_pic":this.profile_pic
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
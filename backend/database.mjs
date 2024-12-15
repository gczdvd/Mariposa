"use strict";

import mysql from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/mysql/index.js';
import {User} from './client.mjs';

export class Sql{
    constructor(ip, username, password, database){
        this.con = mysql.createConnection({
            host: ip,
            user: username,
            password: password,
            database: database
        });
        this.con.connect((err)=>{
            if(err){
                console.log(`Database error: ${err}`);
            }
            else{
                console.log(`Database "${database}" on "${ip}" is connected!`);
            }
        });
    }

    auth(email, password, callback){
        this.con.query(`CALL authUser("${this.con.escape(email)}", "${this.con.escape(password)}");`, (err, rows, fields) => {
            var id = rows[0][0]?.client_id;
            if(id){
                callback(id);
            }
            else{
                callback(null);
            }
        });
    }

    getUserById(id, callback){
        this.con.query(`CALL getClient(${this.con.escape(id)});`, (err, rows, fields) => {
            var data = rows[0][0];
            callback(new User(data.client_id, data.nickname, data.birthdate, data.email, data.topics, data.gender, data.description, data.profile_pic));
            
        });
    }

    modifyUser(id, callback, password="", gender=0, description="", profile_pic="", topics=""){
        this.con.query(`CALL modifyUser(${this.con.escape(id)}, "${this.con.escape(password)}", ${this.con.escape(gender)}, "${this.con.escape(description)}", "${this.con.escape(profile_pic)}", "${this.con.escape(topics)}");`, (err, rows, fields) => {
            var data = rows[0][0];
            callback(data);
        });
    }

    signup(nickname, email, password, birthdate, gender, comment, verify, callback){
        this.con.query(`CALL signupUser("${this.con.escape(nickname)}", "${this.con.escape(email)}", "${this.con.escape(password)}", "${this.con.escape(birthdate)}", ${this.con.escape(gender)}, "${this.con.escape(comment)}", "${this.con.escape(verify)}");`, (err, rows, fields) => {
            callback(rows[0][0].status);
        });
    }

    verifyUser(token, callback){
        this.con.query(`CALL verifyUser("${this.con.escape(token)}");`, (err, rows, fields) => {
            callback(rows[0][0].status, rows[0][0].client_id);
        });
    }

    newGuest(ip, callback){
        this.con.query(`CALL newGuest("${this.con.escape(ip)}");`, (err, rows, fields) => {
            callback(rows[0][0].client_id);
        });
    }

    getChat(cid1, cid2, callback){
        this.con.query(`CALL getChat(${this.con.escape(cid1)}, ${this.con.escape(cid2)});`, (err, rows, fields) => {
            callback(rows[0][0].id);
        });
    }

    newMessage(cid, message, type, chatid){
        this.con.query(`CALL newMessage(${this.con.escape(chatid)}, ${this.con.escape(cid)}, "${this.con.escape(message)}", "${this.con.escape(type)}");`);
    }

    forgotPassword(email, password, callback){
        this.con.query(`CALL forgotPassword("${this.con.escape(email)}", "${this.con.escape(password)}");`, (err, rows, fields) => {
            callback(rows[0][0].status);
        });
    }
}
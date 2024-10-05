"use strict";

import mysql from 'mysql';
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
        this.con.query(`CALL authUser("${email}", "${password}");`, (err, rows, fields) => {
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
        this.con.query(`CALL getClient(${id});`, (err, rows, fields) => {
            var data = rows[0][0];
            callback(new User(data.client_id, data.nickname, data.birthdate, data.email, data.topic));
        });
    }

    signup(nickname, email, password, birthdate, gender, comment, verify, callback){
        this.con.query(`CALL signupUser("${nickname}", "${email}", "${password}", "${birthdate}", ${gender}, "${comment}", "${verify}");`, (err, rows, fields) => {
            callback(rows[0][0].status);
        });
    }

    verifyUser(token, callback){
        this.con.query(`CALL verifyUser("${token}");`, (err, rows, fields) => {
            callback(rows[0][0].status, rows[0][0].client_id);
        });
    }

    newGuest(ip, callback){
        this.con.query(`CALL newGuest("${ip}");`, (err, rows, fields) => {
            callback(rows[0][0].client_id);
        });
    }

    createChat(cid1, cid2, callback){
        this.con.query(`CALL createChat(${cid1}, ${cid2});`, (err, rows, fields) => {
            callback(rows[0][0].id);
        });
    }

    newMessage(cid, message, type, chatid){
        this.con.query(`CALL newMessage(${chatid}, ${cid}, "${message}", "${type}");`);
    }
}
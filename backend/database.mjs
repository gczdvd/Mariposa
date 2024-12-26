"use strict";

import Mysql from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/sync-mysql/lib/index.js';
import {User} from './client.mjs';

export class Sql{
    constructor(ip, username, password, database){
        this.con = new Mysql({
            host: ip,
            user: username,
            password: password,
            database: database
        });
    }

    auth(email, password, callback){
        var rows = this.con.query(`CALL authUser(?, ?);`, [email, password]);
        var id = rows[0][0]?.client_id;

        if(id){
            callback(id);
        }
        else{
            callback(null);
        }
    }

    getUserById(id, callback){
        var rows = this.con.query(`CALL getClient(?);`, [id]);
        var data = rows[0][0];

        callback(new User(data.client_id, data.nickname, data.birthdate, data.email, data.topics, data.gender, data.description, data.profile_pic));
    }

    modifyUser(id, p){
        this.con.query(`CALL modifyUser(?, ?, ?, ?, ?, ?);`, [id, p?.password ?? "", p?.gender ?? 0, p?.description ?? "", p?.profile_pic ?? "", p?.topics ?? "[]"]);
    }

    signup(nickname, email, password, birthdate, gender, comment, verify, callback){
        var rows = this.con.query(`CALL signupUser(?, ?, ?, ?, ?, ?, ?);`, [nickname, email, password, birthdate, gender, comment, verify]);

        callback(rows[0][0].status);
    }

    existEmail(email, callback){
        var rows = this.con.query(`CALL isExistEmail(?);`, [email]);
        
        callback(rows[0][0].exist);
    }

    verifyUser(token, callback){
        var rows = this.con.query(`CALL verifyUser(?);`, [token]);
        
        callback(rows[0][0].status, rows[0][0].client_id);
    }

    newGuest(ip, callback){
        var rows = this.con.query(`CALL newGuest(?);`, [ip]);
        
        callback(rows[0][0].client_id);
    }

    getChat(cid1, cid2, callback){
        var rows = this.con.query(`CALL getChat(?, ?);`, [cid1, cid2]);

        callback(rows[0][0].id);
    }

    newMessage(cid, message, type, chatid){
        this.con.query(`CALL newMessage(?, ?, ?, ?);`, [chatid, cid, message, type]);
    }

    forgotPassword(email, password, callback){
        var rows = this.con.query(`CALL forgotPassword(?, ?);`, [email, password]);

        callback(rows[0][0].status);
    }

    getSavedChatsByUserId(id, callback){
        var rows = this.con.query(`CALL getSavedChatsByUserId(?);`, [id]);

        callback(rows[0]);
    }

    getMessages(chatid, callback){
        var rows = this.con.query(`CALL getMessages(?);`, [chatid]);

        callback(rows[0]);
    }
}
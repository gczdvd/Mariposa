"use strict";

import Mysql from '/root/Mariposa/backend/node_modules/sync-mysql/lib/index.js';
import {User} from './client.mjs';

export class Sql{
    //OK
    constructor(ip, username, password, database){
        this.con = new Mysql({
            host: ip,
            user: username,
            password: password,
            database: database
        });
    }

    //OK
    auth(email, password){
        var rows = this.con.query(`CALL authUser(?, ?);`, [email, password]);
        var id = rows[0][0]?.client_id;

        if(id){
            return id;
        }
        else{
            return null;
        }
    }

    getUserById(id){
        var rows = this.con.query(`CALL getClient(?);`, [id]);
        var data = rows[0][0];

        return (new User(data.client_id, data.nickname, data.birthdate, data.email, data.topics, data.gender, data.description, data.profile_pic));
    }

    //OK
    modifyUser(id, p){
        this.con.query(`CALL modifyUser(?, ?, ?, ?, ?, ?);`, [id, p?.password ?? "", p?.gender ?? 0, p?.description ?? "", p?.profile_pic ?? "", p?.topics ?? "[]"]);
    }

    //OK
    signup(nickname, email, password, verify){
        var rows = this.con.query(`CALL signupUser(?, ?, ?, ?);`, [nickname, email, password, verify]);

        return rows[0][0].status;
    }

    //OK
    existEmail(email){
        var rows = this.con.query(`CALL isExistEmail(?);`, [email]);
        
        return rows[0][0].exist;
    }

    //OK
    verifyUser(token){
        var rows = this.con.query(`CALL verifyUser(?);`, [token]);
        
        return {
            "status":rows[0][0].status,
            "client_id":rows[0][0].client_id
        };
    }

    /*newGuest(ip, callback){
        var rows = this.con.query(`CALL newGuest(?);`, [ip]);
        
        callback(rows[0][0].client_id);
    }*/

    //OK
    getChat(cid1, cid2){
        var rows = this.con.query(`CALL getChat(?, ?);`, [cid1, cid2]);

        return rows[0][0];
    }

    setChatPersistent(chatid, value){
        var rows = this.con.query(`CALL setChatPersistent(?, ?);`, [chatid, value]);
        
        return rows[0][0].status;
    }

    //OK
    newMessage(cid, message, type, chatid){
        this.con.query(`CALL newMessage(?, ?, ?, ?);`, [chatid, cid, message, type]);
    }

    //OK
    forgotPassword(email, password){
        var rows = this.con.query(`CALL forgotPassword(?, ?);`, [email, password]);

        return rows[0][0].status;
    }

    //OK
    getSavedChatsByUserId(id){
        var rows = this.con.query(`CALL getSavedChatsByUserId(?);`, [id]);

        return rows[0];
    }

    //OK
    getMessages(chatid, offset){
        var rows = this.con.query(`CALL getMessages(?, ?);`, [chatid, offset]);

        return rows[0];
    }
}
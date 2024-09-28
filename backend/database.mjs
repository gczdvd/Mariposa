"use strict";

import mysql from 'mysql';
import {User} from './User.mjs';

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

    auth(username, password, callback){
        this.con.query(`CALL authUser("${username}", "${password}");`, (err, rows, fields) => {
            var id = rows[0][0]?.id;
            if(id){
                callback(id);
            }
            else{
                callback(null);
            }
        });
    }

    getUserById(id, callback){
        this.con.query(`CALL getUserById(${id});`, (err, rows, fields) => {
            var data = rows[0][0];
            callback(new User(data.id, data.username, data.birthdate, data.email, data.topic));
        });
    }

    checkExistKeys(username, email, callback){
        this.con.query(`CALL checkExistKeys("${username}", "${email}");`, (err, rows, fields) => {
            var data = rows[0];
            callback(data);
        });
    }

    signup(username, email, password, birthdate, gender, comment){
        this.con.query(`CALL signupUser("${username}", "${email}", "${password}", "${birthdate}", ${gender}, "${comment}");`, (err, rows, fields) => {
            if(err.errno == 1062){
                var duplrow = err.sqlMessage.split(" ");
                console.log(duplrow.pop());
            }
        });
    }
}
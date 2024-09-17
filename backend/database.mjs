"use strict";

import mysql from "mysql";

export class sql{
    constructor(ip, username, password, database){
        this.con = mysql.createConnection({
            host: ip,
            user: username,
            password: password,
            database: database
        });
        this.con.connect((err)=>{
            console.log(`Database "${database}" on "${ip}" is connected!`);
        });
    }

    auth(username, password, callback){
        this.con.query(`SELECT id FROM User WHERE username = '${username}' AND password = md5('${password}');`, (err, rows, fields) => {
            if(rows.length == 1){
                callback(rows[0]);
            }
            else{
                callback(null);
            }
        });
    }
}
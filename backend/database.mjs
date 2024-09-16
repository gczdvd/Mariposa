"use strict";

import mysql from "mysql";

try{
    var con = mysql.createConnection({
        host: "172.16.193.50",
        user: "root",
        password: "root",
        database: "teszt"
    });

    con.connect((err)=>{
        console.log("Connected!");
    });

    con.query('INSERT INTO teszt VALUES ("János", 27)', (err, rows, fields)=>{
        console.log(rows);
    });

    con.query('SELECT * FROM teszt ORDER BY age DESC', (err, rows, fields)=>{
        console.log(rows);
        con.end();
    });
}
catch(e){
    console.log(e);
}
"use strict";

import { WebSocketServer } from "ws";
import { User } from "./User.mjs";

import mysql from "mysql";

try{
    var con = mysql.createConnection({
        host: "172.16.193.50",
        user: "root",
        password: "root"
    });

    con.connect((err)=>{
        console.log("Connected!");
    });
}
catch(e){
    console.log(e);
}

/*
var u = new User(3);
console.log(u.ageszor());

const WebSoc = new WebSocketServer({port:8081});

WebSoc.addListener("connection", (e)=>{
    console.log("Csatlakoztak");
});*/
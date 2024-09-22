"use strict";

import express from 'express';
import websocket from 'express-ws';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { Sql } from './database.mjs';
import { User } from './User.mjs';
import { Session, Sessions } from './session.mjs';

const database = new Sql("172.16.193.50", "root", "root", "mariposa");

var sessions = new Sessions();

const app = express();
app.use(cookieParser());
websocket(app);

app.get('/login', bodyParser.json(), (req, res) => {
    //req.body.username = req.query["u"];
    //req.body.password = req.query["p"];
    var username = req.query["u"];
    var password = req.query["p"];
    if(!sessions.getSessionByToken(req.cookies.token)?.valid()){
        if(username && password){
            database.auth(username, password, (id)=>{
                if(id != null){
                
                    const sess = sessions.newSession();
                    res.status(200);
                    res.cookie("token", sess.getToken(), { expires: sess.getExpire(), httpOnly: true, secure: true });
                    res.send("Welcome!");
                    
                    database.getUserById(id, (u)=>{
                        sess.setAttribute("user", u);
                    });
                }
                else{
                    res.status(401)
                    res.send('Invalid credentials.');
                }
            });
        }
        else{
            res.status(400);
            res.send("Missing username or password.");
        }
    }
    else{
        var sess = sessions.getSessionByToken(req.cookies.token);
        console.log(sess.getId());
        sess.touch();
        res.cookie("token", sess.getToken(), { expires: sess.getExpire(), httpOnly: true, secure: true });
        res.status(200);
        res.send(`You are logged in! Username: ${sess.getAttribute("user").getUsername()}`);
    }
});

app.get('/logout', (req, res) => {
    var sess = sessions.getSessionByToken(req.cookies.token);
    if(sess?.valid()){
        if(sessions.removeSession(sess)){
            res.cookie("token", "-", { maxAge: 0, httpOnly: true, secure: true });
            res.status(200);
            res.send(`Goodbye!`);
        }
        else{
            res.status(500);
            res.send(`Unknown error.`);
            console.error("Valid user can't do logout.");
        }
    }
    else{
        res.status(200);
        res.send(`You aren't logged in!`);
    }
});
/*
app.get('/home', (req, res) => {
    console.log(req.session.userId);
    if (req.session.userId) {
        res.send(`Welcome to the Home page, User ${JSON.stringify(req.session)}!`);
    }
    else {
        res.status(401)
        res.send('Unauthorized');
    }
});
*/

app.ws('/live', (ws, req) => {
    ws.on('message', function(msg) {
        var sess = sessions.getSessionByToken(req.cookies.token);
        if(sess?.valid()) {
            console.log(msg);
        }
        else{
            ws.close();
        }
    });
});


app.listen(3000, () => {
    console.log("Api/Websocket server running on port 3000");
});
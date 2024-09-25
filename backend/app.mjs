"use strict";

//VENDÉG SESSIONT ÍRNI, igen, az adatbázisban is. :)

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

const sessionValidator = function(req, res, next){
    var session = {
        id: req.cookies.sessId,
        valid: Boolean(sessions.getSessionById(req.cookies.sessId)?.valid()),
        session: sessions.getSessionById(req.cookies.sessId)
    }
    if(session.valid){
        session.session.touch();
    }
    req.session = session;
    next();
}

const sessionGuard = function(req, res, next){
    if(req.session.valid){
        next();
    }
    else{
        res.cookie("sessId", "-", { maxAge: 0, httpOnly: true, secure: true });
        res.status(400);
        res.send('Invalid session.');
        //ÁTIRÁNYÍTHAT A BEJELENTKEZŐ FELÜLETRE
    }
}

app.use(
    cookieParser(),
    bodyParser.json(),
    sessionValidator
);

websocket(app);

//---------------PUBLIC---------------//

app.get('/login', (req, res) => {

    //req.body.username = req.query["u"];
    //req.body.password = req.query["p"];
    var username = req.query["u"];
    var password = req.query["p"];
    if(!req.session.valid){
        if(username && password){
            database.auth(username, password, (id)=>{
                if(id != null){
                
                    const sess = sessions.newSession();
                    res.status(200);
                    res.cookie("sessId", sess.getId(), { expires: Session.neverExpire(), httpOnly: true, secure: true });
                    res.send("Welcome!");
                    //ÁTIRÁNYÍTHAT A KEZDŐLAPRA
                    
                    database.getUserById(id, (u)=>{
                        sess.setAttribute("user", u);
                    });
                }
                else{
                    res.status(401);
                    res.send('Invalid credentials.');
                    //ÁTIRÁNYÍTHAT A BEJELENTKEZŐ FELÜLETRE
                }
            });
        }
        else{
            res.status(400);
            res.send("Missing username or password.");
            //ÁTIRÁNYÍTHAT A BEJELENTKEZŐ FELÜLETRE
        }
    }
    else{
        res.send("/home");
        res.status(200);
        //ÁTIRÁNYÍTHAT A KEZDŐLAPRA
    }
});

app.get('/logout', (req, res) => {
    if(req.session.valid){
        if(sessions.removeSession(req.session.session)){
            res.cookie("sessId", "-", { maxAge: 0, httpOnly: true, secure: true });
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

app.get('/home', (req, res) => {
    if (req.session.valid) {
        res.status(200);
        res.send(`Welcome User ${req.session.id}!`);
    }
    else {
        res.status(200);
        res.send(`Welcome Guest!`);
    }
});

//---------------PRIVATE---------------//

app.get('/teszt', sessionGuard, (req, res) => {
    res.status(200);
    res.send(Object.keys(req));
});

app.ws('/live', (ws, req) => {
    ws.on('message', function(msg) {
        if(sessions.getSessionById(req.session.id)?.valid()) {
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
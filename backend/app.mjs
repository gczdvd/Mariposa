"use strict";

import express from 'express';
import session from 'express-session';
import websocket from 'express-ws';
import bodyParser from 'body-parser';

import {Sql} from './database.mjs';
import {User} from './User.mjs';

const database = new Sql("172.16.193.50", "root", "root", "mariposa");

const app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false, //Ennek még utána kell járni
    saveUninitialized: false, //Ennek még utána kell járni
    cookie: {
        httpOnly: true, //Ennek még utána kell járni
        maxAge: 600000
    }
}));
//app.use(express.cookieParser());

websocket(app);

app.get('/login', bodyParser.json(), (req, res) => {
    req.body.username = req.query["u"];
    req.body.password = req.query["p"];
    if(!req.session.userId){
        if(req.body.username && req.body.password){
            database.auth(req.body.username, req.body.password, (id)=>{
                if(id != null){
                    req.session.userId = (new Date().getTime()); // Store user ID in session
                    database.getUserById(id, (u)=>{
                        u.setSession(req.session.userId);
                        req.session.user = u;
                    });
                    res.status(200);
                    res.send("Welcome!");
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
        res.status(200);
        res.send(`You are logged in!`);
    }
});

app.get('/logout', (req, res) => {
    if(req.session.userId){
        req.session.destroy();
        res.status(200);
        res.send(`Goodbye!`);
    }
    else{
        res.status(200);
        res.send(`You aren't logged in!`);
    }
});

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

app.ws('/live', (ws, req) => {
    ws.on('message', function(msg) {
        console.log(req.session.userId);
        if (req.session.userId) {
            console.log(msg);
            req.session.touch();
        }
        else{
            ws.close();
        }
    });
});


app.listen(3000, () => {
    console.log("Api/Websocket server running on port 3000");
});
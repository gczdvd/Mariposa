"use strict";

//VENDÉG SESSIONT ÍRNI, igen, az adatbázisban is. :)

import express from 'express';
import websocket from 'express-ws';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import md5 from 'md5';

import { Sql } from './database.mjs';
import { User, Guest } from './client.mjs';
import { Chat, Chats } from './chat.mjs';
import { Session, Sessions } from './session.mjs';
import { Email } from './mail.mjs';
import { Finder } from './finder.mjs';

const database = new Sql("172.30.0.100", "root", "MariposaProject2024%", "mariposa");
const smtp = new Email("172.30.0.100", 25);
const chats = new Chats(database);

const sessions = new Sessions(34560000000);
const finder = new Finder(sessions, chats);

const app = express();

const sessionParser = function(req, res, next){
    var session = {
        id: req.cookies.sessId,
        valid: Boolean(sessions.getSessionById(req.cookies.sessId)?.valid()),
        session: sessions.getSessionById(req.cookies.sessId)
    }
    if(session.valid){
        session.session.touch();
    }
    else{
        res.cookie("sessId", "-", { maxAge: 0, httpOnly: true, secure: true });
    }
    req.session = session;
    console.log(session);
    next();
}

const sessionValidator = function(req, res, next){
    if(req.session.valid){
        next();
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/login",
            "message":"Invalid session."
        }));
    }
}

const sessionOnlyUser = function(req, res, next){
    if(req.session.session.getAttribute("client") instanceof User){
        next();
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"You don't have permission."
        }));
    }
}

app.use(
    cookieParser(),
    bodyParser.json(),
    sessionParser
);

websocket(app);

//---------------PUBLIC---------------//

app.post('/signup', (req, res) => {
    /*
        fetch("http://127.0.0.1:3000/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email:"teszt@asd.zt",
                birthdate:"2015-05-07",
                username:"Béla",
                password:"titkos",
                gender:3,
                comment:"Béla vagyok"
            }) 
        }).then(async (e)=>{
            console.log(await e.json());
        });
    */

    var nickname = req.body?.nickname;
    var email = req.body?.email;
    var password = req.body?.password;
    var birthdate = req.body?.birthdate;
    var gender = req.body?.gender;
    var comment = req.body?.comment;
    if(!req.session.valid){
        if(nickname && email && password && birthdate && !isNaN(gender)){
            database.signup(nickname, email, password, birthdate, gender, comment, md5(email), (s)=>{
                if(s == "Success"){
                    smtp.verify(email, md5(email));
                    res.status(200);
                    res.send(JSON.stringify({
                        "message":"You can login, if verified your email."
                    }));
                    
                }
                else{
                    res.status(409);
                    res.send(JSON.stringify({
                        "action":"error",
                        "message":"Exist account with this email address."
                    }));
                }
            });
        }
        else{
            res.status(400);
            res.send(JSON.stringify({
                "action":"redirect",
                "value":"/signup",
                "message":"Missing data."
            }));
        }
    }
    else{
        res.status(200);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"You are already logged in."
        }));
    }
});

app.post('/login', (req, res) => {

    //#######################---BELÉPÉS
    /*
        fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: "teszt", 
                password: "alma" 
            }) 
        })
        .then(async (e)=>{
            console.log(await e.json());
        });
    */

    var email = req.body.email;
    var password = req.body.password;
    if(!req.session.valid){
        if(email && password){
            database.auth(email, password, (id)=>{
                if(id != null){
                
                    const sess = sessions.newSession();
                    res.status(200);
                    res.cookie("sessId", sess.getId(), { expires: Session.neverExpire(), httpOnly: true, secure: true });
                    res.send(JSON.stringify({
                        "action":"redirect",
                        "value":"/",
                        "message":"Successful login."
                    }));
                    
                    database.getUserById(id, (u)=>{
                        sess.setAttribute("client", u);
                    });
                }
                else{
                    res.status(401);
                    res.send(JSON.stringify({
                        "action":"redirect",
                        "value":"/",
                        "message":"Invalid credentials."
                    }));
                }
            });
        }
        else{
            res.status(400);
            res.send(JSON.stringify({
                "action":"redirect",
                "value":"/login",
                "message":"Missing email or password."
            }));
        }
    }
    else{
        res.status(200);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"You are already logged in."
        }));
    }
});

app.get('/signup/verify', (req, res) => {
    database.verifyUser(req.query["token"], (s, id)=>{
        if(s == "Success"){
            database.getUserById(id, (e)=>{
                smtp.verifySuccess(e.getEmail(), e.getNickname());
                res.status(200);
                res.send(JSON.stringify({
                    "action":"redirect",
                    "value":"/login",
                    "message":"Verified."
                }));
            });
        }
        else{
            res.status(409);
            res.send(JSON.stringify({
                "action":"error",
                "message":"Unexpected error."
            }));
        }
    });
});

app.get('/guest', (req, res) => {
    if(!req.session.valid){
        database.newGuest(req.ip, (id)=>{
            const sess = sessions.newSession();
            res.status(200);
            res.cookie("sessId", sess.getId(), { expires: Session.neverExpire(), httpOnly: true, secure: true });
            res.send(JSON.stringify({
                "action":"redirect",
                "value":"/",
                "message":"Successful guested."
            }));
            
            sess.setAttribute("client", new Guest(id));
        });
    }
    else{
        res.status(200);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"You are already has a session."
        }));
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

app.get('/', (req, res) => {
    if (req.session.valid) {
        res.status(200);
        res.send(`Welcome ${req.session.id}!`);
    }
    else {
        res.status(200);
        res.send(`Who are you?`);
    }
});

//---------------PRIVATE---------------//

/*app.get('/user', sessionValidator, sessionOnlyUser, (req, res) => {
    res.status(200);
    res.send("You're User!");
});*/

app.get('/chat', sessionValidator, (req, res) => {
    if(!(req.session.session.getAttribute("chat") instanceof Chat)){
        req.session.session.setAttribute("chat", "waiting");
        res.status(200);
        res.send("Waiting for partner...");
    }
    else{
        res.status(200);
        res.send("You have partner!");
    }
    //FELVENNI A USER-T A PARTNERKERESŐK LISTÁJÁRA.
    //WEBSOCKET CSAK PARTNER TALÁLÁS UTÁN JÖJJÖN LÉTRE, ÉS A SSESSION USERHEZ LEGYEN FŰZVE A CHAT ID. 
    //Session a középpont, nem a User
    /*res.status(200);
    res.send(req.ip);*/
});

app.ws('/live', (ws, req) => {
    ws.on('message', function(msg) {
        var sess = sessions.getSessionById(req.session.id);
        if(sess?.valid() && (sess?.getAttribute("chat") instanceof Chat)) {
            sess.touch();
            const cid = sess.getAttribute("client").getId();
            sess.getAttribute("chat").newMessage(cid, msg, "text/plain");
            console.log(cid + ": " + msg);
        }
        else{
            ws.close();
        }
    });
});

setInterval(()=>{
    console.log(sessions.sessions);
    sessions.cleanUp();
}, 10000)

app.listen(3000, () => {
    console.log("Api/Websocket server running on port 3000");
});
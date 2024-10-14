"use strict";

import express from 'express';
import websocket from 'express-ws';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import md5 from 'md5';
import crypto from 'crypto';

import { Sql } from './database.mjs';
import { Generator } from './generator.mjs';
import { Tasks } from './task.mjs';
import { User, Guest } from './client.mjs';
import { Chat, Chats, Finder, Want } from './chat.mjs';
import { Session, Sessions } from './session.mjs';
import { Email } from './mail.mjs';

const cryptKey = crypto.randomBytes(32);

const database = new Sql("172.30.0.100", "root", "MariposaProject2024%", "mariposa");
const smtp = new Email("172.30.0.100", 25, "noreply@mariposachat.hu");
const chats = new Chats(database);

const tasks = new Tasks();

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

app.post('/forgotpassword', (req, res)=>{
    if(req.body.email){
        var task = tasks.newTask(240, {
            "email":req.body.email
        });

        var id = task.getId();
        var key = Generator.encrypt(cryptKey, id);

        smtp.forgotPassword(req.body.email, key);
        res.status(200);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"Success"
        }));
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"error",
            "message":"Missing email."
        }));
    }
});

app.post('/forgotpassword/change', (req, res)=>{
    var key = req.query["key"];
    if(key){
        var id = Generator.decrypt(cryptKey, key)
        var task = tasks.getTaskById(id);

        if(task){
            var password = req.body.password;
            if(password){
                database.forgotPassword(task.getAttribute("email"), password, (status)=>{
                    if(status == "Success"){
                        res.status(200);
                        res.send(JSON.stringify({
                            "action":"redirect",
                            "value":"/",
                            "message":"Success"
                        }));
                    }
                    else{
                        res.status(400);
                        res.send(JSON.stringify({
                            "action":"error",
                            "message":"No user with this email."
                        }));
                    }
                });
                tasks.removeTask(task);
            }
            else{
                res.status(200);
                res.send(JSON.stringify({
                    "action":"redirect",
                    "value":"/changepassword!!!",
                    "message":"Valid"
                }));
            }
        }
        else{
            res.status(400);
            res.send(JSON.stringify({
                "action":"error",
                "message":"Bad key."
            }));
        }

    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"error",
            "message":"Missing key."
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

app.get('/chat', sessionValidator, (req, res) => {                  //Ezen kérés előtt, de a bejelentkezés után KÖTELEZŐ websocketet nyitni
    if(req.session.session.getAttribute("chat") instanceof Chat){
        res.status(200);
        res.send(JSON.stringify({
            "action":"redirect",
            "value":"/",
            "message":"You have partner."
        }));
    }
    else{
        req.session.session.setAttribute("chat", new Want());
        res.status(200);
        res.send("Waiting for partner...");
    }
});

app.ws('/live', function(ws, req) {
    ws.on('message', function(msg) {
        var sess = sessions.getSessionById(req.session.id);
        ws.send(msg);
        console.log(msg);
        if(sess?.valid()) {
            sess.touch();
            if(sess.getAttribute("chat") instanceof Chat){
                sess.getAttribute("chat").newMessage(sess, msg, "text/plain");
            }
        }
        else{
            ws.close();
        }
    });
    req.session.session.setAttribute("websocket", ws);
    //Onclose delete from session attribute!
});

setInterval(()=>{
    console.log(sessions.sessions);
    console.log(tasks.getTasks());
    sessions.cleanUp();
}, 10000)

app.listen(3000, () => {
    console.log("Api/Websocket server running on port 3000");
});

//Teszt sor
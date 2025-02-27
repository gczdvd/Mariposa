"use strict";

// import express from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/express/index.js';
// import websocket from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/express-ws/index.js';
// import cookieParser from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/cookie-parser/index.js';
// import bodyParser from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/body-parser/index.js';
// import md5 from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/md5/md5.js';
// import crypto from 'crypto';
// import cors from 'file://C:/Users/David/AppData/Roaming/npm/node_modules/cors/lib/index.js'

import express from '/root/Mariposa/backend/node_modules/express/index.js';
import websocket from '/root/Mariposa/backend/node_modules/express-ws/index.js';
import fileUpload from '/root/Mariposa/backend/node_modules/express-fileupload/lib/index.js';
import cookieParser from '/root/Mariposa/backend/node_modules/cookie-parser/index.js';
import bodyParser from '/root/Mariposa/backend/node_modules/body-parser/index.js';
import md5 from '/root/Mariposa/backend/node_modules/md5/md5.js';
import CryptoJS from '/root/Mariposa/backend/node_modules/crypto-js/index.js';
import cors from '/root/Mariposa/backend/node_modules/cors/lib/index.js'
import uuid from '/root/Mariposa/backend/node_modules/uuid/dist/esm/v6.js';
import crypto from 'crypto';
import fs from 'fs';

import { Sql } from './database.mjs';
import { Generator } from './generator.mjs';
import { Tasks } from './task.mjs';
import { User, Users, Guest } from './client.mjs';
import { Chat, Chats, Finder, Want } from './chat.mjs';
import { Session, Sessions } from './session.mjs';
import { Email } from './mail.mjs';
import { Access } from './access.mjs';

const cryptKey = crypto.randomBytes(32);

var secrets = JSON.parse(fs.readFileSync("./secrets.key"));

const database = new Sql("127.0.0.1", secrets.database.user, secrets.database.pass, "mariposa");
const smtp = new Email("127.0.0.1", 25, "noreply@mariposachat.hu");
const chats = new Chats(database);
const users = new Users(database);

const tasks = new Tasks();

const sessions = new Sessions(34560000000/*280000*/);
const finder = new Finder(sessions, chats, database);

var app = express();

function replacer(key,value)
{
    if (key=="websocket"){
        return "ws";
    }
    if (key=="profile_pic"){
        return "base64";
    }
    return value;
}

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
    // console.dir(JSON.parse(JSON.stringify(session, replacer, 10)), { depth: null });
    next();
}

const sessionValidator = function(req, res, next){
    if(req.session.valid){
        //res.cookie("info", req.session.session?.getAttribute("client")?.getInfo());
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
    fileUpload({
        limits: {
            fileSize: 50 * 1024 * 1024,
            abortOnLimit: true
        },
    }),
    bodyParser.json(),
    cors({
        origin: 'https://mariposachat.hu/api',
        credentials: true
    }),
    sessionParser
);

websocket(app);

//---------------PUBLIC---------------//

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    if(!req.session.valid){
        if(email && password){
            var keys = password.split(',');
            var nowt = (new Date()).getTime();
            if(keys[0] > nowt - 20000 && keys[0] < nowt + 20000){
                var id = database.auth(email, keys[0], keys[1]);

                if(id != null){

                    sessions.removeSession(sessions.getSessionByUserId(id));

                    const sess = sessions.newSession();
                    res.status(200);
                    res.cookie("sessId", sess.getId(), { expires: Session.neverExpire(), httpOnly: true, secure: true });
                    res.send(JSON.stringify({
                        "action":"redirect",
                        "value":"/chat",
                        "message":"Successful login."
                    }));
                    
                    var u = users.getUserById(id);
                    sess.setAttribute("client", u);

                    sess.setAttribute("access", new Access());
                }
                else{
                    res.status(401);
                    res.send(JSON.stringify({
                        "action":"alert",
                        "value":"invalid",
                        "message":"Invalid credentials."
                    }));
                }
            }
            else{
                res.status(401);
                res.send(JSON.stringify({
                    "action":"alert",
                    "value":"timeout",
                    "message":"Key timeout."
                }));
            }
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
    var nickname = req.body?.nickname;
    var email = req.body?.email;
    var password = req.body?.password;
    if(!req.session.valid){
        if(nickname && email && password){
            var s = database.signup(nickname, email, password, md5(email));
            if(s == "Success"){
                smtp.verify(email, md5(email));
                res.status(200);
                res.send(JSON.stringify({
                    "action":"redirect",
                    "value":"/login",
                    "message":"You can login, if verified your email."
                }));
                
            }
            else{
                res.status(409);
                res.send(JSON.stringify({
                    "action":"alert",
                    "value":"exist",
                    "message":"Exist account with this email address."
                }));
            }
        }
        else{
            res.status(400);
            res.send(JSON.stringify({
                "action":"redirect",
                "value":"/registration",
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
        var exist = database.existEmail(req.body.email);

        if(exist){
            var task = tasks.newTask(240, {
                "email":req.body.email
            });

            var id = task.getId();
            var key = Generator.encrypt(cryptKey, id);

            smtp.forgotPassword(req.body.email, key, database);
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
                "message":"Email doesn't exists."
            }));
        }
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
    if(req.body.key){
        var id = Generator.decrypt(cryptKey, req.body.key)
        var task = tasks.getTaskById(id);

        if(task){
            var password = req.body.password;
            if(password){
                var status = database.forgotPassword(task.getAttribute("email"), password);
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
    var tmp = database.verifyUser(req.query["token"]);
    
    if(tmp.status == "Success"){
        var e = users.getUserById(tmp.client_id);
        
        smtp.verifySuccess(e.getEmail(), e.getNickname());
        res.status(200);
        res.send(JSON.stringify({
            "action":"alert",
            "value":"success",
            "message":"Verified."
        }));
    }
    else{
        res.status(409);
        res.send(JSON.stringify({
            "action":"error",
            "message":"Unexpected error."
        }));
    }
});

app.post('/message', (req, res) => {
    smtp.support(req.body.email, req.body.name, req.body.text);
    res.status(200);
    res.send(JSON.stringify({
        "action":"none",
        "value":"",
        "message":"Success"
    }));
});

/*app.get('/guest', (req, res) => {
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
});*/

app.get('/logout', (req, res) => {
    if(req.session.valid){
        if(sessions.removeSession(req.session.session)){
            res.cookie("sessId", "-", { maxAge: 0, httpOnly: true, secure: true });
            res.status(200);
            res.send(JSON.stringify({"message":"Goodbye!"}));
        }
        else{
            res.status(500);
            res.send(JSON.stringify({"message":"Unknown error."}));
            console.error("Valid user can't do logout.");
        }
    }
    else{
        res.status(200);
        res.send(JSON.stringify({"message":"You aren't logged in!"}));
    }
});

/* app.get('/', (req, res) => {
     if (req.session.valid) {
         res.status(200);
         res.send(JSON.stringify({"message":"Welcome ${req.session.id}!"}));
     }
     else {
         res.status(200);
         res.send(JSON.stringify({"message":"Who are you?"}));
     }
});*/

//---------------PRIVATE---------------//

/*app.get('/user', sessionValidator, sessionOnlyUser, (req, res) => {
    res.status(200);
    res.send("You're User!");
});*/

app.get("/deleteprofile", sessionValidator, (req, res) => {
    database.deleteUser(req.session.session.getAttribute("client").getId());
    sessions.removeSession(req.session.session);

    res.status(200);
    res.send(JSON.stringify({
        "action":"redirect",
        "value":"/",
        "message":"See You! :("
    }));
});

app.post("/profilemodify", sessionValidator, (req, res) => {
    database.modifyUser(req.session.session.getAttribute("client").getId(), req.body);
    res.status(200);
    res.send(JSON.stringify({
        "action":"",
        "value":"",
        "message":"Successful modified."
    }));
});

app.post('/modifypassword', sessionValidator, (req, res) => {
    if(req.body.newpassword && req.body.oldpassword){
        var id = database.auth(req.session.session.getAttribute("client").getEmail(), req.body.oldpassword);

        if(id != null){
            database.modifyUser(id, {password:req.body.newpassword});
            res.status(200);
            res.send(JSON.stringify({
                "action":"redirect",
                "value":"/",
                "message":"Successful modified."
            }));
        }
        else{
            res.status(400);
            res.send(JSON.stringify({
                "action":"error",
                "message":"Bad old password."
            }));
        }
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"error",
            "message":"Missing parameters."
        }));
    }
});

app.post("/report", sessionValidator, (req, res) => {   //EZT INKÁBB WSBE
    if(req.session.session.getAttribute("chat") instanceof Chat){
        var me = req.session.session.getAttribute("client").getInfo();
        smtp.report(me, JSON.stringify({"id" : req.session.session.getAttribute("chat").getPartnerByCid(me.id)}), req.session.session.getAttribute("chat").getId(me.id));
        res.status(200);
        res.send(JSON.stringify({
            "action":"none",
            "value":"",
            "message":"Reported."
        }));
    }
});

app.post('/profilepic', sessionValidator, (req, res) => {
    var ext = req.files.file.name.split(".").pop();
    if(ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "webp"){
        var npfile = uuid() + "." + ext;
        req.files.file.mv("storage/profile_pic/" + npfile);
        database.modifyUser(req.session.session.getAttribute("client").getId(), {profile_pic:npfile});
        res.status(200);
        res.send(JSON.stringify({
            "action":"none",
            "value":"",
            "message":"ok"
        }));
    }
    else{
        res.status(400);
        res.send(JSON.stringify({
            "action":"none",
            "value":"",
            "message":"Wrong extension"
        }));
    }
});

app.get('/storage/*', sessionValidator, (req, res) => {
    var relPath = req.originalUrl.slice(1);
    if(req.session.session.getAttribute("access").get(relPath)){
        res.status(200);
        res.send(fs.readFileSync(relPath));
    }
    else{
        res.status(403);
        res.send(relPath + "<br>" + JSON.stringify(req.session.session.getAttribute("access").all()));
    }
});

app.get('/userinfo', sessionValidator, (req, res) => {
    res.status(200);

    var path = 'storage/profile_pic/' + database.getUserDataById(req.session.session.getAttribute("client").getId()).profile_pic;
    req.session.session.getAttribute("access").add(path);

    res.send(JSON.stringify(req.session.session.getAttribute("client").getInfo()));
});

app.get('/partners', sessionValidator, (req, res) => {
    var partners = database.getSavedChatsByUserId(req.session.session.getAttribute("client").getId());

    partners.forEach((v, i, a) => {
        var path = 'storage/profile_pic/' + v.profile_pic;
        req.session.session.getAttribute("access").add(path);
        a[i].profile_pic = '/api/' + path;
    });

    res.status(200);
    res.send(JSON.stringify({
        "action":"none",
        "value":{
            "partners":partners
        },
        "message":"OK"
    }));
});

app.get('/chat/reloaded', sessionValidator, (req, res) => {
    if(req.session.session.getAttribute("chat") instanceof Chat){
        req.session.session.getAttribute("chat").leftUser(req.session.session);
    }

    res.status(200);
    res.send(JSON.stringify({
        "action":"none",
        "value":"",
        "message":"ok"
    }));
});

app.post('/chat', sessionValidator, (req, res) => {                  //Ezen kérés előtt, de a bejelentkezés után KÖTELEZŐ websocketet nyitni
    /*if(req.session.session.getAttribute("chat") instanceof Chat){
        res.status(200);
        res.send(JSON.stringify({
            "action":"none",
            "value":"",
            "message":"You have partner."
        }));
    }
    else{*/
        if(req.session.session.getAttribute("chat") instanceof Chat){
            req.session.session.getAttribute("chat").leftUser(req.session.session);
        }

        if(req.body?.chatid){
            
            var partners = database.getSavedChatsByUserId(req.session.session.getAttribute("client").getId());

            var hasPartnerWithThisId = false;
            for(var i = 0; i < partners.length; i++){
                if(partners[i].chat_id == req.body.chatid){
                    hasPartnerWithThisId = true;
                    break;
                }
            }

            if(hasPartnerWithThisId){
                var tchat = chats.findChatById(req.body.chatid);
                if(tchat == null){
                    tchat = chats.newChat(req.session.session, req.body.chatid, true);
                }
                else{
                    tchat.setUser(req.session.session);
                }

                req.session.session.setAttribute("chat", tchat);

                res.status(200);
                res.send(JSON.stringify({
                    "action":"none",
                    "value":"",
                    "message":"connected"
                }));
            }
            else{
                res.status(400);
                res.send(JSON.stringify({
                    "action":"reload",
                    "value":"",
                    "message":"Invalid partner ID"
                }));
            }
        }
        else{
            req.session.session.setAttribute("chat", new Want());
            res.status(200);
            res.send(JSON.stringify({"message":"Waiting for partner..."}));
        }
    //}
});

app.ws('/live', function(ws, req) {
    if(sessions.getSessionById(req.session.id)?.valid()){
        if(req.session.session.getWebsocket()){
            req.session.session.getWebsocket()?.close();
        }
        ws.on('message', function(msg) {
            var sess = sessions.getSessionById(req.session.id);
            if(sess?.valid()) {
                sess.touch();
                if(sess.getAttribute("chat") instanceof Chat){
                    try{
                        var jmsg = JSON.parse(msg);
                        if(jmsg.type == "message"){
                            sess.getAttribute("chat").newMessage(sess, jmsg.value, "text/plain");
                        }
                        else if(jmsg.type == "action"){
                            if(jmsg.value == "end"){
                                sess.getAttribute("chat").end();
                            }
                            else if(jmsg.value == "save"){
                                if(!sess.getAttribute("chat").wantToPersistent(sess, users)){
                                    sess.getAttribute("chat").getPartner(sess).getWebsocket()?.send(JSON.stringify({
                                        "type":"action",
                                        "name":"requestSave",
                                        "value":null
                                    }));
                                }
                            }
                            else if(jmsg.value == "history"){
                                var e = sess.getAttribute("chat").getMessages(jmsg.time ?? null);
                                console.log(jmsg);
                                for(var i = e.length - 1; i >= 0; i--){
                                    var pers = (e[i].client_id == sess.getAttribute("client").getId());
                                    sess.getWebsocket()?.send(JSON.stringify({
                                        "from":pers ? 0 : 1,
                                        "type":e[i].content_type,
                                        "message":e[i].message_value,
                                        "time":e[i].send_time,
                                        "insert":"old"
                                    }));
                                }
                            }
                            else if(jmsg.value == "identity"){
                                if(sess.getAttribute("chat").getSaved()){
                                    sess.getAttribute("chat").sendIdentity(users);
                                }
                                else{
                                    sess.getWebsocket()?.send(JSON.stringify({
                                        "type":"info",
                                        "value":"No permission"
                                    }));
                                }
                            }
                        }
                    }
                    catch{}
                }
            }
            else{
                ws.close();
            }
        });
        req.session.session.setWebsocket(ws);
    }
});

app.listen(3000, () => {
    console.log("Api/Websocket server running on port 3000");
});

setInterval(()=>{
    // process.stdout.write('\x1Bc');
    console.dir(JSON.parse(JSON.stringify(sessions.sessions, replacer, 4)), { depth: null });
    console.dir(JSON.parse(JSON.stringify(chats.getChats(), replacer, 4)), { depth: null });
    console.dir(tasks.getTasks(), {"depth":2});
    sessions.cleanUp();
}, 1000)
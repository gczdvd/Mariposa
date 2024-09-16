"use strict";
/*
import { WebSocketServer } from "ws";
import { User } from "./User.mjs";


var u = new User(3);
console.log(u.ageszor());

const WebSoc = new WebSocketServer({port:8081});

WebSoc.addListener("connection", (e)=>{
    console.log("Csatlakoztak");
});*/





import express from 'express';
import session from 'express-session';
import websocket from 'express-ws';
import bodyParser from 'body-parser';

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

const socket = websocket(app);

app.get('/login', bodyParser.json(), (req, res) => {
    /*if(req.body.username && req.body.password){
        text.indexOf("@") != -1
    }
    else{
        res.status(400);
        res.send("Missing username or password.");
    }*/
    const password = req.query["password"];
    
    const user = password == "alma";
  
    if (user) {
      req.session.userId = Math.round(Math.random()*10000); // Store user ID in session
      console.log(req.session.userId);
      res.redirect("/home");
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

  app.get('/home', (req, res) => {
    console.log(req.session.userId)
    if (req.session.userId) {
      // User is authenticated
      res.send(`Welcome to the Home page, User ${req.session.userId}!`);
    } else {
      // User is not authenticated
      res.status(401).send('Unauthorized');
    }
  });


  app.ws('/', (ws, req) => {
    console.log(req.session.userId);
    if (req.session.userId) {
        ws.on('message', function(msg) {
            console.log(msg);
        });
    }
    else{
        ws.close();
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});

/*app.get('/users-list', (req, res) => {
    res.status(404);
    console.log(req.session);
    res.send("ok: " + req.query["valami"]);
});*/
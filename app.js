import { WebSocketServer } from "ws"

const WebSoc = new WebSocketServer({port:8081});

WebSoc.addListener("connection", (e)=>{
    console.log("Csatlakoztak");
});

//Teszt
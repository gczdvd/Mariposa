"use strict";

import fs from 'fs';
import nodemailer from '/root/Mariposa/backend/node_modules/nodemailer/lib/nodemailer.js';
import parse_html from '/root/Mariposa/backend/node_modules/node-html-parser/dist/index.js';

function HTMLFileFormat(html, change){
    const root = parse_html.parse(fs.readFileSync(html, {encoding: 'utf8', flag: 'r'}));
    change(root);
    return root.toString();
}

export class Email{
    constructor(host, port, sender){//('172.30.0.100', 25)
        this.sender = sender;
        this.transport = nodemailer.createTransport({
            /*
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            */
            /*
                host: 'localhost',
                port: 25,
                tls: {
                    rejectUnauthorized: false
                }
            */
            host: host,
            port: port,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    support(emaila, username, name, message){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <guest@mariposachat.hu>`,
            to: "support@mariposachat.hu",
            subject: "Támogatás kérése",
            html: `Küldő neve: <b>${name}</b><br>Küldő felhasználóneve: <b>${username}</b><br>Küldő email-címe: <b>${emaila}</b><br>Küldő üzenete:<br>${message}`
        });
    }

    report(reporter, reported, chatid){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <report@mariposachat.hu>`,
            to: "support@mariposachat.hu",
            subject: "Jelentettek egy felhasználót!",
            html: '<b>Chat ID:</b> ' + chatid + '<br><br><b style="color:green;">Jelentő:</b><br>' + JSON.stringify(reporter) + '<br><br><b style="color:red;">Jelentett:</b><br>' + reported
        });
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <noreply@mariposachat.hu>`,
            to: reporter.email,
            subject: "Bejelentésed megkaptuk!",
            html: HTMLFileFormat('emails/userreport/userreport.html', (e)=>{
                e.getElementById("username").innerHTML = reporter.nickname;
            })
        });
    }

    verify(email, token){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Regisztráció megerősítése",
            html: HTMLFileFormat('emails/welcome/welcome.html', (e)=>{
                e.getElementById("confirmButton").setAttribute("href", `https://mariposachat.hu/login/?token=${token}`);
            })
        });
        return token;
    }

    verifySuccess(email, name){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Sikeres regisztráció!",
            html: HTMLFileFormat('emails/confirm/confirm.html', (e)=>{
                e.getElementById("username").innerHTML = name;
            })
        });
    }

    forgotPassword(email, key, db){
        var username = db.getUserByEmail(email, db).getInfo().nickname;
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Elfelejtett jelszó visszaállítása",
            html: HTMLFileFormat('emails/forgotpassword/forgotpsw.html', (e)=>{
                e.getElementById("confirmButton").setAttribute("href", `https://mariposachat.hu/forgotpsw/?key=${key}`);
                e.getElementById("username").innerHTML = username;
            })
        });
    }
}

/*var e = new Email('172.30.0.100', 25, "support@mariposachat.hu");
e.verify("gogodavid19@gmail.com", "TESZT");*/
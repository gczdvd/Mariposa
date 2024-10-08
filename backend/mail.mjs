"use strict";

import fs from 'fs';
import nodemailer from 'nodemailer';
import parse_html from 'node-html-parser';

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

    verify(email, token){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Verify your account!",
            html: HTMLFileFormat('emails/confirm/confirm.html', (e)=>{
                e.getElementById("confUrl").setAttribute("href", `http://127.0.0.1:3000/signup/verify?token=${token}`);
            })
        });
        return token;
    }

    verifySuccess(email, name){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Successful verified your account!",
            html: `
                <div style="width:100%;text-align:center;">
                    <h2>Dear ${name}!</h2>
                    <h2>Success</h2>
                </div>`
        });
    }

    forgotPassword(email, token){
        this.transport.sendMail({
            from: `"Mariposa - The Social Butterfly" <${this.sender}>`,
            to: email,
            subject: "Forgot password",
            html: `
                <div style="width:100%;text-align:center;">
                    <h2>Click:</h2>
                    <h2><a href="http://127.0.0.1:3000/forgotpassword/change?token=${token}">Klikk</a></h2>
                </div>`
        });
    }
}

/*var e = new Email('172.30.0.100', 25, "support@mariposachat.hu");
e.verify("gogodavid19@gmail.com", "TESZT");*/
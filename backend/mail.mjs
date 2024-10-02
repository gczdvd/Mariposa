"use strict";

import fs from 'fs';
import nodemailer from 'nodemailer';
import { parse } from 'node-html-parser';

function HTMLFileFormat(html, change){
    const root = parse(fs.readFileSync(html, {encoding: 'utf8', flag: 'r'}));
    console.log(root);
    change(root);
    return root.toString();
}

export class Email{
    constructor(host, port){//('172.30.0.100', 25)
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

    verify(email, code){
        this.transport.sendMail({
            from: '"Mariposa - The Social Butterfly" <noreply@gogotech.hu>',
            to: email,
            subject: "Verify your account!",
            html: `
                <div style="width:100%;text-align:center;">
                    <h2>Click to verify:</h2>
                    <a href="http://127.0.0.1:3000/signup/verify?token=${code}">Verify</a>
                </div>`
        });
        return code;
    }

    verifySuccess(email, name){
        this.transport.sendMail({
            from: '"Mariposa - The Social Butterfly" <noreply@gogotech.hu>',
            to: email,
            subject: "Successful verified your account!",
            html: `
                <div style="width:100%;text-align:center;">
                    <h2>Dear ${name}!</h2>
                    <h2>Success</h2>
                </div>`
        });
    }
}

console.log(HTMLFileFormat('emails/confirm/confirm.html', (e)=>{
    e.getElementById("t").innerHTML = "Hi";
}));
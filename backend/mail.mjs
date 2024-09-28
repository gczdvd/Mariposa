"use strict";

import nodemailer from 'nodemailer';

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
            subject: code + " is your verify code",
            html: `
                <div style="width:100%;text-align:center;">
                    <h2>Your verify code:</h2>
                    <h1>${code}</h1>
                </div>`
        });
        return code;
    }
}
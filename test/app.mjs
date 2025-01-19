import fs from 'fs';
import nodemailer from 'file://C:\\Users\\xcsiz\\AppData\\Roaming\\npm\\node_modules\\nodemailer\\lib\\nodemailer.js';

var transport = nodemailer.createTransport({
    host: "172.29.0.100",
    port: 25,
    tls: {
        rejectUnauthorized: false
    }
});

transport.sendMail({
    from: `"Mariposa - The Tester Butterfly" <test@mariposachat.hu>`,
    to: "support@mariposachat.hu",
    subject: process.argv[2],
    html: fs.readFileSync(process.argv[3], {encoding: 'utf8', flag: 'r'})
});
"use strict";

import fs from 'fs';
import crypto from 'crypto';

const iv = Buffer.from([0x30, 0x67, 0xc7, 0xe8, 0x37, 0x21, 0x4a, 0x43, 0xdb, 0x75, 0xe6, 0xbb, 0x98, 0xaf, 0x7e, 0x17]);

export class Generator{
    static words(language, _length){
        var data = fs.readFileSync('words/' + language + '.txt', 'utf8');
        var words = data.split('\r\n');
        var list = [];
        for(var i = 0; i < _length; i++){
            var ranum = Math.floor(Math.random() * words.length);
            list.push(words[ranum]);
        }
        return list;
    }
    static number(range=10000){
        return Math.round(Math.random()*range);
    }
    static encrypt(key, value){
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(String(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    static decrypt(key, value){
        try{
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(String(value), 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch(e){
            return null;
        }
    }
}
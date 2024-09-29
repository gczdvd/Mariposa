"use strict";

import fs from 'fs';

export class Generator{
    static words(language, _length, callback){
        fs.readFile('words/' + language + '.txt', 'utf8', (err, data)=>{
            if(!err){
                var words = data.split('\r\n');
                var list = [];
                for(var i = 0; i < _length; i++){
                    var ranum = Math.floor(Math.random() * words.length);
                    list.push(words[ranum]);
                }
                callback(list);
            }
            else{
                callback(null);
            }
        });
    }
}
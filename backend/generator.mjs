"use strict";

import fs from 'fs';

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
}
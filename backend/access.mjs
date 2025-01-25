'use strict';

export class Access{
    #items = [];
    constructor(){

    }
    get(item){
        for(var i = 0; i < this.#items.length; i++){
            if(this.#items[i] == item){
                return true;
            }
        }
        return false;
    }
    add(item){
        if(!this.get(item)){
            this.#items.push(item);
        }
    }
    remove(item){
        for(var i = 0; i < this.#items.length; i++){
            if(this.#items[i] == item){
                this.#items.splice(i, 1);
                break;
            }
        }
    }
    all(){
        return this.#items;
    }
}
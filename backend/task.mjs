'use strict';

import { Generator } from "./generator.mjs";

export class Task{
    constructor(id, timeout, attributes={}){
        this.expire = new Date((new Date()).getTime() + timeout * 1000);
        this.attributes = attributes;
        this.id = id;
    }
    getId(){
        return this.id;
    }
    getExpire(){
        return this.expire;
    }
    getAttribute(key){
        return this.attributes[key];
    }
    setAttribute(key, value){
        this.attributes[key] = value;
    }
}

export class Tasks{
    constructor(autoCleanUp=true){
        this.tasks = [];
        if(autoCleanUp){
            setInterval(()=>{
                this.cleanUp();
            }, 5000);
        }
    }
    genId(){
        do{
            var testId = Generator.number();
            var trySess = this.getTaskById(testId);
        }
        while(trySess != null);
        return testId;
    }
    getTaskById(id){
        for(var i = 0; i < this.tasks.length; i++){
            if(this.tasks[i].getId() == id){
                return this.tasks[i];
            }
        }
        return null;
    }
    newTask(timeout, attributes={}){
        const nTask = new Task(this.genId(), timeout, attributes);
        this.tasks.push(nTask);
        return nTask;
    }
    removeTask(task){
        for(var i = 0; i < this.tasks.length; i++){
            if(this.tasks[i] == task){
                this.tasks.splice(task);
                return true;
            }
        }
        return false;
    }
    getTask(filter){
        for(var i = 0; i < this.tasks.length; i++){
            if(filter(this.tasks[i])){
                return this.tasks[i];
            }
        }
        return null;
    }
    getTasks(){
        return this.tasks;
    }
    cleanUp(){
        for(var i = 0; i < this.tasks.length; i++){
            if(this.tasks[i].getExpire().getTime() < (new Date()).getTime()){
                this.removeTask(this.tasks[i]);
            }
        }
    }
}
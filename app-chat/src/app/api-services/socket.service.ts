import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000/';
  private socket;
  private room;
  
  constructor() {}

   sendMessage(message:string,username:string){
     this.socket.emit('message',{"text":message,"user":username,"type":"message"});
   }

   userInRoom(){return this.room}

   getMessages(){
     return new Observable(observer=>{
       this.socket.on("messages",function(data){
         observer.next(data);
       },()=>{this.socket.emit("")})
      })
    }

    joinRoom(group:string,channel:string,user:string){
      this.room = group + "_" + channel;
      this.socket = io(this.url);
      this.socket.emit('join',{"channel":channel,"group":group,"user":user});
    }
    
    leaveRoom(){this.socket.emit('leave');}

    newMessage(){
      return new Observable(observer=>{
        this.socket.on("message",function(data){
          observer.next(data);
        })
      })
    }
}

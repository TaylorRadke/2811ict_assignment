import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = io('http://localhost:3000/');
  private room;
  
  constructor() {}

   sendMessage(message:string){
     this.socket.emit('message',{"text":message,"user":sessionStorage.getItem('username'),"type":"message"});
   }

   sendImage(image:string){
     this.socket.emit("message",{"user":sessionStorage.getItem("username"),"type":"image","image":image});
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

    update(){
      this.socket.emit("new_update");
    }

    listenUpdate(){
      return new Observable(observer=>{
        this.socket.on("updated",function(){
          observer.next();
        });

      })
    }
}

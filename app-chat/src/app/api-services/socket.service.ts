import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000/'
  private socket;
  private room;
  
  constructor() {
    this.socket = io(this.url);
  }

   sendMessage(message:string,avatar:string){
     this.socket.emit('message',{"text":message,"user":sessionStorage.getItem('username'),"type":"message","avatar":avatar});
   }

   sendImage(image:string,avatar:string){
     this.socket.emit("message",{"user":sessionStorage.getItem("username"),"type":"image","image":image,"avatar":avatar});
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
      this.socket = io(this.url);
      if (this.room) {this.leaveRoom();}
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

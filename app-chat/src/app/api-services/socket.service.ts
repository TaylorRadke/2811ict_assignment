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
     this.socket.emit('add-message',{"text":message,"user":username});
   }

   disconnect(){
     this.socket.disconnect();
   }

   getMessages(){
     let observable = new Observable(observer=>{
       this.socket.on("message",(data)=>{
         observer.next(data);
       })
       return ()=>{
         this.socket.disconnect();
       }
     })
     return observable;
    }

    joinRoom(group:string,channel:string,user:string){
      this.room = group+ "_" + channel;
      this.socket = io(this.url);
      this.socket.emit('join',{"room":this.room,"user":user});
    }

    leaveRoom(){
      this.socket.to(this.room).emit('leave');
    }
}

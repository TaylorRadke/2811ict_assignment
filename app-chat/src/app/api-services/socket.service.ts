import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket;

  constructor() {}

   sendMessage(message){
     this.socket.emit('add-message',message);
   }

   getMessages(){
     this.socket = io(this.url);

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
}

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket = io(this.url);

  constructor() {}

   sendMessage(message){
     console.log(message);
     this.socket.emit('add-message',message);
   }

   getMessages(){
     this.socket = io(this.url);

     let observable = new Observable(observer=>{
       this.socket.on("message",(data)=>{
         console.log(data);
         observer.next(data);
       })
       return ()=>{
         this.socket.disconnect();
       }
     })
     return observable;
    }
}

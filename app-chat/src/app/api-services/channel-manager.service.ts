import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {

  constructor(private http:HttpClient) { }

  getChannels(group:string){
    return this.http.get('/api/'+group+'/channels');
  }

  getChannelUsers(group:string,channel:string){
    return this.http.get('/api/'+group+'/'+channel+'/users');
  }

  createChannel(group:string,channel:string){
    return this.http.post('/api/groups/channels',{
      "group":group,
      "channel":channel
    });
  }

  addUser(username:string,group:string,channel:string){
    return this.http.post('/api/groups/channels/users',{
      "username":username,
      "group":group,
      "channel":channel
    });
  }

  removeUser(username:string,group:string,channel:string){
    return this.http.delete('/api/'+group+'/'+channel+'/'+username);
  }

  removeChannel(group:string,channel:string){
    console.log(group,channel);
    return this.http.delete("/api/"+group+'/'+channel);
  }

  userIsIn(username:string){
    return this.http.get('/api/groups/'+username+'/channels');
  }
}

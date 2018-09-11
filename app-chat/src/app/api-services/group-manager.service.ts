import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupManagerService {

  constructor(private http:HttpClient) { }

  getGroups(){
    return this.http.get('/api/groups');
  }

  createGroup(group:string){
    return this.http.post("/api/groups",{
      "group":group
    });
  };

  addUser(username:string,group:string){
    return this.http.post("/api/groups/users",{
      "username":username,
      "group":group
    });
  }

  getUsers(group:string){
    return this.http.get("/api/"+group+"/users");
  }

  deleteGroup(group:string){
    return this.http.delete("/api/groups/"+group);
  }

  removeUser(group:string,user:string){
    return this.http.delete("/api/groups/"+group+"/"+user);
  }

}

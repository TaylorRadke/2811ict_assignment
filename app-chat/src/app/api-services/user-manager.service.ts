import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  constructor(private http:HttpClient) { }

  createUser(username:string,email:string){
    return this.http.post('/api/users',{"username":username,"email":email});
  }

  getUsers(){
    return this.http.get('/api/users');
  }

  modifyPermissions(fromUser:string,username:string,newPermissions:string){
    return this.http.post('/api/users/permissions',{
      "username":username,
      "permissions":newPermissions
    });
  }

  getPermissions(username:string){
    return this.http.get("/api/"+username+"/permissions");
  }

  login(username:string,password:string){
    return this.http.post('/api/users/login',{"username":username,"password":password});
  }

  deleteUser(username:string){
    return this.http.delete("/api/users/"+username);
  }
}

import { Component, OnInit } from '@angular/core';
import {GroupManagerService} from '../api-services/group-manager.service';
import {UserManagerService} from '../api-services/user-manager.service';
import { SocketService } from '../api-services/socket.service';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.css']
})

export class GroupSettingsComponent implements OnInit {

  options = ['',"create","delete","add","remove"];
  groups;
  groupCreate;
  groupDelete;
  groupAddUser;
  userAdd;
  groupIndex:number;
  userRemove;
  groupUserRemove;
  hasGroups;
  users;
  username;
  userSelected;
  addUsername;
  groupSelected;

  constructor(private groupManager:GroupManagerService, private userManager:UserManagerService,private socket:SocketService) { }

  ngOnInit() {
    this.updateGroups();
    this.getUsers();
  }

  //Update all groups that have changed
  updateGroups(){
    this.groupManager.getGroups().subscribe(res=>{
      this.groups = [];
      res["groups"].forEach(element=>{
        this.groups.push(element.group_name);
        
      })
      this.hasGroups = true;
    });

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    })
  }

  getUsers(){
    this.userManager.getUsers().subscribe(res=>{
      this.users =[];
      res["users"].forEach(user=>{
        this.users.push(user.username);
      });
    });
  }
  //Create a group
  createGroup(){
    this.groupManager.createGroup(this.groupCreate).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
        this.socket.update();
      }
    });
    
  }

  //Delete a group
  deleteGroup(){
    this.groupManager.deleteGroup(this.groupDelete).subscribe(res=>{
      if(res["success"]){
        this.updateGroups();
        this.socket.update();
      }
    });
  }

  //Add user to a group
  addUser(){
    this.groupManager.addUser(this.userAdd,this.groupAddUser).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
        this.socket.update();
      }
    });  
  }

  //Remove user from a group
  removeUser(){
    this.groupManager.removeUser(this.groupSelected,this.userSelected).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
        this.socket.update();
      }
    });
  } 

  getGroupUsers(){
    this.groupManager.getGroups().subscribe(res=>{
      res["groups"].forEach(element=>{
        if (element.group_name == this.groupSelected){
          this.users = element.users;
        }
      })
    })
  }
}

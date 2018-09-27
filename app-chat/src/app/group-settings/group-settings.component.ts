import { Component, OnInit } from '@angular/core';
import {GroupManagerService} from '../api-services/group-manager.service';
import {UserManagerService} from '../api-services/user-manager.service';

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
  usersInGroup;


  constructor(private groupManager:GroupManagerService, private userManager:UserManagerService) { }

  ngOnInit() {
    this.groupManager.getGroups().subscribe(res=>{
      this.groups = res["groups"];
      if (this.groups.length > 0) this.hasGroups = true;
      else this.hasGroups = false;
    });

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    });
  }

  //Update all groups that have changed
  updateGroups(){
    this.groupManager.getGroups().subscribe(res=>{
      this.groups = res["groups"];
      if (this.groups.length > 0 ) this.hasGroups = true;
      else this.hasGroups = false;
    });

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    })
  }

  //Create a group
  createGroup(){
    this.groupManager.createGroup(this.groupCreate).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
      }
    });
    
  }

  //Delete a group
  deleteGroup(){
    this.groupManager.deleteGroup(this.groupDelete).subscribe(res=>{
      if(res["success"]){
        this.updateGroups();
      }
    });
  }

  //Add user to a group
  addUser(){
    this.groupManager.addUser(this.userAdd,this.groupAddUser).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
      }
    });  
  }

  //Remove user from a group
  removeUser(){
    this.groupManager.removeUser(this.groups[this.groupUserRemove].group,this.userRemove).subscribe(res=>{
      if (res["success"]){
        this.updateGroups();
      }
    });
  } 

  //See if the group has any users
  checkUsersInGroup(){
    this.updateGroups();
    if (this.groups[this.groupUserRemove].users.length > 0 && this.groups[this.groupUserRemove] !== 'undefined'){
      this.usersInGroup = true;
    }else{
      this.usersInGroup = false;
    }
  }
}

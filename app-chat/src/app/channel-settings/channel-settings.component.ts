import { Component, OnInit} from '@angular/core';
import {ChannelManagerService} from '../api-services/channel-manager.service';
import {GroupManagerService} from '../api-services/group-manager.service';
import {UserManagerService} from '../api-services/user-manager.service';

 
@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.css']
})
export class ChannelSettingsComponent implements OnInit {

  channels;
  channelName;
  channelUsers;
  users;

  groups;
  groupUsers;
  selectUser;
  selectGroup;
  selectChannel;

  hasGroups;
  settingsSelect
  options = ['',"create","delete","remove","add"];


  constructor(private channelManager:ChannelManagerService, private userManager:UserManagerService,
  private groupManager:GroupManagerService) { }

  ngOnInit() {
    this.groupManager.getGroups().subscribe(res=>{
      this.groups = [];
      res["groups"].forEach(element=>{
        this.groups.push(element.group_name);
        this.hasGroups = true;
      })
    });

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    })
  }

  //Create a channel
  createChannel(){
    this.channelManager.createChannel(this.selectGroup,this.channelName)
    .subscribe();
  }

  //Get all channels in a group
  getChannels(){
    this.channelManager.getChannels(this.selectGroup).subscribe(res=>{
      this.channels = res["channels"];
    })
  }

  //delete a channel in a group
  deleteChannel(){
    this.channelManager.removeChannel(this.selectGroup,this.selectChannel).subscribe(res=>{
      if (res["channel_deleted"]){
        this.getChannels();
      }
    })
  }

  //Get users of a channel
  getChannelUsers(){
    this.channelManager.getChannelUsers(this.selectGroup,this.selectChannel).subscribe(res=>{
      this.channelUsers = res["users"];
    })
  }

  //Add a user to a channel
  addUserChannel(){
    this.channelManager.addUser(this.selectUser,this.selectGroup,this.selectChannel).subscribe(res=>{
      if (res["user-added-to-channel"]){
        this.channelManager.getChannelUsers(this.selectGroup,this.selectChannel).subscribe(res=>{
          this.channelUsers = res["users"];
        })
      }
    })
  }

  //Remove a user from a channel
  removeUser(){
    this.channelManager.removeUser(this.selectUser,this.selectGroup,this.selectChannel).subscribe(res=>{
      if (res["user-deleted"]){
        this.channelManager.getChannelUsers(this.selectGroup,this.selectChannel).subscribe(res=>{
          if (res["user_removed"]){
            this.channelUsers = res["users"];
          }
          
        });
      }
    })
  }

  //Get all users in a group
  getGroupUsers(){
    this.groupManager.getUsers(this.selectGroup).subscribe(res=>{
      this.groupUsers = res["users"];
    });
  }

}

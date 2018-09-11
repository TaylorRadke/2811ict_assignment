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
      this.groups = res["groups"];
      if (this.groups.length > 0) this.hasGroups = true;
      else this.hasGroups = false;
    });

    this.userManager.getUsers().subscribe(res=>{
      console.log(res);
      this.users = res["users"];
    })
  }

  //Create a channel
  createChannel(){
    this.channelManager.createChannel(this.selectGroup,this.channelName)
    .subscribe(res=>{
      console.log(res);
    })
  }

  //Get all channels in a group
  getChannels(){
    this.channelManager.getChannels(this.selectGroup).subscribe(res=>{
      this.channels = [];
      var channel = res['channels'];
      for (let i = 0; i < channel.length; i++){
        this.channels.push(channel[i].channel);
      }
    })
  }

  //delete a channel in a group
  deleteChannel(){
    this.channelManager.removeChannel(this.selectGroup,this.selectChannel).subscribe(res=>{
      console.log(res);
      if (res["channel-removed"]){
        this.getChannels();
      }
    })
  }

  //Get users of a channel
  getChannelUsers(){
    console.log("getting channel users");
    this.channelManager.getChannelUsers(this.selectGroup,this.selectChannel).subscribe(res=>{
      this.channelUsers = res["users"];
      console.log(this.channelUsers);
    })
  }

  //Add a user to a channel
  addUserChannel(){
    this.channelManager.addUser(this.selectUser,this.selectGroup,this.selectChannel).subscribe(res=>{
      if (res["user-added-to-channel"]){
        this.channelManager.getChannelUsers(this.selectGroup,this.selectChannel).subscribe(res=>{
          console.log(res);
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
          this.channelUsers = res["users"];
          console.log(res);
        });
      }
    })
  }

  //Get all users in a group
  getGroupUsers(){
    this.groupManager.getUsers(this.selectGroup).subscribe(res=>{
      this.groupUsers = res["users"];
      console.log(res);
    });
  }

}

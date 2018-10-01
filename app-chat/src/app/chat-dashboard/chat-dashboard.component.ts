import { Component, OnInit, Input } from '@angular/core';
import {SocketService} from '../api-services/socket.service';
import {Router} from '@angular/router';
import {UserManagerService} from '../api-services/user-manager.service';
import {ChannelManagerService} from '../api-services/channel-manager.service';
import {GroupManagerService} from '../api-services/group-manager.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})
export class ChatDashboardComponent implements OnInit {
  username:string;
  messages;
  message:string;
  users;
  groups;
  settingsSelect;
  userHasPermission;
  channels;
  channelUsers;
  showUsers;
  chatDisplay;
  inChannel;
  group;

  constructor(private socket:SocketService, private router:Router,
    private userManager:UserManagerService, private channelManager:ChannelManagerService,
    private groupManager:GroupManagerService) { }

  ngOnInit() {
    
    this.username = localStorage.getItem("username");
    if (this.username === "undefined") this.logout();
    this.chatDisplay = false;

    this.userManager.getPermissions(this.username).subscribe(res=>{
      if (res["permissions"] == "group" || res["permissions"] == "super") this.userHasPermission = true;
    });

    this.getUserGroups();

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    });
  }

  //Logout as a user
  logout(){
    localStorage.clear();
    this.socket.disconnect();
    this.router.navigateByUrl('');
  }

  
  showSettings(selectedSetting:string){
    this.settingsSelect = selectedSetting;
  }

  getUserGroups(){
    this.channelManager.userIsIn(localStorage.getItem("username")).subscribe(res=>{
      this.groups = res["groups"];
    });
  }
  //Display Channels for a group
  displayChannels(group:string){
    this.group = group;
    this.channelManager.getChannels(group).subscribe(res=>{
      this.channels = res["channels"];
    });
  }

  //Show users in a channel in a group
  showUsersInChannel(channel:string){
    this.channelManager.getChannelUsers(this.group,channel).subscribe(res=>{
      this.channelUsers = res["users"];
      this.showUsers = true;
      this.chatDisplay = true;
    });
  }

  joinChannel(channel:string){
    this.inChannel = channel;
    if (this.socket.userInRoom()){this.socket.leaveRoom();}
    this.socket.joinRoom(this.group,channel,this.username);
    
    this.socket.getMessages().subscribe(res=>{
      this.messages=res["messages"]});

    this.socket.newMessage().subscribe(res=>{
      console.log(res["message"]);
      this.messages.push(res["message"]);
    });
  }

  sendMessage(){
    if (this.message != ''){
      this.socket.sendMessage(this.message,this.username);
    }
  }
}

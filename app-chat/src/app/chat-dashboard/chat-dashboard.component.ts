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
  messages=[];
  message;
  hasAdminPriviledges=true;
  users;
  groups;
  settingsSelect;
  userHasPermission;
  groupsUserIsIn;
  channelsInGroup;
  channels;
  channelUsers;
  groupSelected;
  showUsers = false;
  chatDisplay;
  inChannel = false;

  constructor(private socket:SocketService, private router:Router,
    private userManager:UserManagerService, private channelManager:ChannelManagerService,
    private groupManager:GroupManagerService) { }

  ngOnInit() {
    this.username = localStorage.getItem("username");
    if (this.username === "undefined"){
      this.logout();
    }
    this.chatDisplay = false;

    this.userManager.getPermissions(this.username).subscribe(res=>{
      if (res["permissions"] == "group" || res["permissions"] == "super"){
        this.userHasPermission = true;
      }else{
        this.userHasPermission = false;
      }
    });

    this.channelManager.userIsIn(localStorage.getItem("username")).subscribe(res=>{
      this.groups = res["groups"];
    });

    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
    })


  }

  //Logout as a user
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('');
  }

  showSettings(selectedSetting:string){
    console.log(selectedSetting);
    this.settingsSelect = selectedSetting;
  }

  //Display Channels for a group
  displayChannels(groupDisplay:string){
    this.groupSelected = groupDisplay;
    this.channelManager.getChannels(groupDisplay).subscribe(res=>{
      console.log(res);
      this.channels = res["channels"];
      this.channelsInGroup = [];
      for (let i = 0; i < this.channels.length; i++){
        this.channelsInGroup.push(this.channels[i].channel);
      }
    });
  }

  //Show users in a channel in a group
  showUsersInChannel(channel:string){
    this.channelManager.getChannelUsers(this.groupSelected,channel).subscribe(res=>{
      this.channelUsers = res["users"];
      this.showUsers = true;
      this.chatDisplay = true;
      console.log(res);
    });
  }

  joinChannel(channel:string){
    this.inChannel = true;
  }
}

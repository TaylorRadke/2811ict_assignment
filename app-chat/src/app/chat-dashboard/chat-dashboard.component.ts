import { Component, OnInit, Input } from '@angular/core';
import {SocketService} from '../api-services/socket.service';
import {Router} from '@angular/router';
import {UserManagerService} from '../api-services/user-manager.service';
import {ChannelManagerService} from '../api-services/channel-manager.service';
import {ImageuploadService} from '../api-services/imageupload.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})
export class ChatDashboardComponent implements OnInit {
  username:string;
  messages;
  message:string;
  groups;
  settingsSelect;
  userHasPermission;
  channels;
  channelUsers;
  inChannel;
  group;
  selectedImage;

  constructor(private socket:SocketService, private router:Router,
    private userManager:UserManagerService, private channelManager:ChannelManagerService,
    private img:ImageuploadService) { }

  ngOnInit() {
    
    this.username = sessionStorage.getItem("username");
    if (this.username === "undefined") this.logout();

    this.userManager.getPermissions(this.username).subscribe(res=>{
      if (res["permissions"] == "group" || res["permissions"] == "super") this.userHasPermission = true;
    });

    this.getUserGroups();
    this.socket.listenUpdate().subscribe(()=>{
        this.getUserGroups();
        if(this.group) this.displayChannels(this.group);
        if (this.inChannel){this.showUsersInChannel(this.inChannel);}
    });
  }
  //Logout as a user
  logout(){
    this.socket.leaveRoom();
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  
  showSettings(selectedSetting:string){
    this.settingsSelect = selectedSetting;
  }

  getUserGroups(){
    this.channelManager.userIsIn(this.username).subscribe(res=>{
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
      this.userManager.getUsers().subscribe(res=>{
        var a = [];
        this.channelUsers.forEach(element=>{
          res["users"].forEach(user=>{
            if (element == user.username) a.push(user);
          })
        })
        this.channelUsers = a;
      })
      
    });
  }

  joinChannel(channel:string){
    this.inChannel = channel;
    if (this.socket.userInRoom()){this.socket.leaveRoom();}
    this.socket.joinRoom(this.group,channel,this.username);

    this.socket.getMessages().subscribe(res=>{
      this.messages=res["messages"];
      this.socket.newMessage().subscribe(res=>{
        this.messages.push(res["message"]);
      });
    });
    this.showUsersInChannel(this.inChannel);

  }

  sendMessage(){
    if (this.message != ''){
      this.socket.sendMessage(this.message);
      this.message = '';
    }
  }

  imgMessage(event){
    this.selectedImage = event.target.files[0];

    if(confirm("Upload " + this.selectedImage.name + "?")){
      var fd = new FormData();
      fd.append('image',this.selectedImage,this.selectedImage.name);
      this.img.imgUpload(fd).subscribe(res=>{
        if (res["result"] == "ok"){
          this.socket.sendImage(this.selectedImage.name);
        }
      })
    }
  }
}

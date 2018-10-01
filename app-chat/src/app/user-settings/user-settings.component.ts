import { Component, OnInit } from '@angular/core';
import {UserManagerService} from '../api-services/user-manager.service';
import {Router} from '@angular/router';
import {SocketService} from '../api-services/socket.service';
import {ImageuploadService} from '../api-services/imageupload.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  userChangePermission;
  newPermission;

  userPermissions;
  hasAdminPermissions;
  users;
  newUsername;
  newUserPassword;
  userDelete;
  superUser;
  username:string;
  userSelected:string;
  permissionSelected:string;
  
  userSettingSelection:string;

  selectedFile = null;
  imagePath;

  constructor(
    private userManager:UserManagerService,
    private router:Router,
    private socket:SocketService,
    private imgService:ImageuploadService) { }

  ngOnInit() {
    this.userManager.getUsers().subscribe(res=>{
      this.users = res["users"];
      this.username = sessionStorage.getItem("username");
    });

    this.userManager.getPermissions(sessionStorage.getItem("username")).subscribe(data=>{
      this.userPermissions = data["permissions"];
      if (this.userPermissions == "super"){
        this.userPermissions = ["super","group"];
        this.superUser = true;
      }else{
        this.superUser = false;
        this.userPermissions = [data["permissions"]];
      }
    });
  }

  //Change a users permissions
  changeUserPermissions(){
    this.userManager.modifyPermissions(sessionStorage.getItem("username"),
    this.userSelected,this.permissionSelected).subscribe(res=>{
      if (res["success"]){
        this.userManager.getUsers().subscribe(res=>{
          this.users = res["users"];
        })
      }
    });
  }

  //Create a new user
  createUser(){
    this.userManager.createUser(this.newUsername,this.newUserPassword).subscribe(res=>{
      if (res["success"]){
        this.userManager.getUsers().subscribe(res=>{
          this.users = res["users"];
          this.socket.update();
        })
      }
    });
  }

  //Delete a user
  deleteUser(){
    if(confirm("Are you sure you want to delete " + this.userDelete +"? They will be unable to login")){
      this.userManager.deleteUser(this.userDelete).subscribe(res=>{
        if (this.userDelete == sessionStorage.getItem("username")){
          sessionStorage.clear();
          this.router.navigate[('')];
        }
        this.userManager.getUsers().subscribe(res=>{
          this.users = res["users"];
        })
        this.socket.update();
      })
    };
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
  }

  uploadImage(){
    const fd = new FormData();
    fd.append('image',this.selectedFile,this.selectedFile.name);
    this.imgService.imgUpload(fd).subscribe(res=>{
      this.imagePath = res["data"].filename;
      if (res["result"] == "ok"){
        this.imgService.imgUploadDB(this.imagePath).subscribe();
      }
    })
  }
}

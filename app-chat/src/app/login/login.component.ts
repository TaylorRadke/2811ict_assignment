import { Component, OnInit } from '@angular/core';
import {UserManagerService} from '../api-services/user-manager.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string;
  password:string;
  loginFail = false;

  constructor(private userManager:UserManagerService,private router:Router) { }

  ngOnInit() {
  }

  //Login, navigate to chat-dashboard
  login(){
    this.userManager.login(this.username,this.password).subscribe(res=>{
      if (res["authlogin"]){
        sessionStorage.setItem("username",this.username);
        this.router.navigate(['/chat-dashboard']);
      }else{
        this.loginFail = true;
        sessionStorage.clear();
      }
    });
  }
}

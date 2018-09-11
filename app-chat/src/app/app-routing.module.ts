import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ChatDashboardComponent} from "./chat-dashboard/chat-dashboard.component";
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {GroupSettingsComponent} from './group-settings/group-settings.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'chat-dashboard',component:ChatDashboardComponent},
  {path:'user-settings',component:UserSettingsComponent},
  {path:'group-settings',component:GroupSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
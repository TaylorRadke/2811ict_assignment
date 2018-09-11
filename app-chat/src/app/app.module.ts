import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';

import {SocketService} from './api-services/socket.service';
import {ChannelManagerService} from './api-services/channel-manager.service';
import {GroupManagerService} from './api-services/group-manager.service';
import {UserManagerService} from './api-services/user-manager.service';
import { ChannelSettingsComponent } from './channel-settings/channel-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatDashboardComponent,
    UserSettingsComponent,
    GroupSettingsComponent,
    ChannelSettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    SocketService,
    ChannelManagerService,
    GroupManagerService,
    UserManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

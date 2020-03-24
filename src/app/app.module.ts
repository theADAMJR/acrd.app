import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { CommandsComponent } from './commands/commands.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { InviteComponent } from './invite/invite.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GuildComponent } from './guild/guild.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { CommandsModuleComponent } from './commands-module/commands-module.component';
import { AnnounceModuleComponent } from './announce-module/announce-module.component';
import { AutoModModuleComponent } from './auto-mod-module/auto-mod-module.component';
import { GeneralModuleComponent } from './general-module/general-module.component';
import { MusicModuleComponent } from './music-module/music-module.component';
import { LogModuleComponent } from './log-module/log-module.component';
import { SettingsModuleComponent } from './settings-module/settings-module.component';
import { XPModuleComponent } from './xp-module/xp-module.component';
import { GuildSidebarComponent } from './guild-sidebar/guild-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CommandsComponent,
    AuthComponent,
    LoginComponent,
    InviteComponent,
    LogoutComponent,
    DashboardComponent,
    SidebarComponent,
    GuildComponent,
    SpinnerComponent,
    CommandsModuleComponent,
    AnnounceModuleComponent,
    AutoModModuleComponent,
    GeneralModuleComponent,
    MusicModuleComponent,
    XPModuleComponent,
    LogModuleComponent,
    SettingsModuleComponent,
    XPModuleComponent,
    GuildSidebarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

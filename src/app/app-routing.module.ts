import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommandsComponent } from './commands/commands.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { InviteComponent } from './invite/invite.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuildComponent } from './guild/guild.component';
import { DashboardAuthGuard } from './dashboard-auth.guard';
import { GuildAuthGuard } from './guild-auth.guard';
import { GeneralModuleComponent } from './general-module/general-module.component';
import { XPModuleComponent } from './xp-module/xp-module.component';
import { MusicModuleComponent } from './music-module/music-module.component';
import { AutoModModuleComponent } from './auto-mod-module/auto-mod-module.component';
import { AnnounceModuleComponent } from './announce-module/announce-module.component';
import { LogModuleComponent } from './log-module/log-module.component';
import { SettingsModuleComponent } from './settings-module/settings-module.component';
import { CommandsModuleComponent } from './commands-module/commands-module.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'commands', component: CommandsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'invite', component: InviteComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardAuthGuard] },

  { path: 'servers/:id', component: GuildComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/announce', component: AnnounceModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/auto-mod', component: AutoModModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/commands', component: CommandsModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/general', component: GeneralModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/music', component: MusicModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/xp', component: XPModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/log', component: LogModuleComponent, canActivate: [GuildAuthGuard] },
  { path: 'servers/:id/settings', component: SettingsModuleComponent, canActivate: [GuildAuthGuard] },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

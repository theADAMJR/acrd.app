import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './authentication/auth/auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { DashboardOverviewComponent } from './dashboard/me/me-overview/me-overview.component';
import { GuildComponent } from './dashboard/guilds/guild-overview/guild-overview.component';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';
import { GuildAuthGuard } from './guards/guild-auth.guard';
import { CanDeactivateDashboard } from './guards/can-deactivate-dashboard.guard';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { TextChannelComponent } from './dashboard/guilds/text-channel/text-channel.component';
import { GuildSettingsComponent } from './dashboard/guilds/guild-settings/overview/guild-settings.component';
import { InvitesComponent } from './dashboard/guilds/guild-settings/invites/invites.component';
import { RolesComponent } from './dashboard/guilds/guild-settings/roles/roles.component';
import { DMChannelAuthGuard } from './guards/dmchannel-auth.guard';
import { DMChannelComponent } from './dashboard/me/dmchannel/dmchannel.component';
import { UserSettingsComponent } from './dashboard/me/user-settings/user-settings.component';
import { BotListComponent } from './dashboard/guilds/guild-settings/bot-list/bot-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'channels/@me',
    component: DashboardOverviewComponent,
    canActivate: [DashboardAuthGuard]
  },
  {
    path: 'channels/@me/settings',
    component: UserSettingsComponent,
    canActivate: [DashboardAuthGuard]
  },
  {
    path: 'channels/@me/:channelId',
    component: DMChannelComponent,
    canActivate: [DMChannelAuthGuard, DashboardAuthGuard]
  },
  {
    path: 'channels/:guildId',
    component: GuildComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/settings',
    component: GuildSettingsComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/roles',
    component: RolesComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/bots',
    component: BotListComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/invites',
    component: InvitesComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/:channelId',
    component: TextChannelComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  // {
  //   path: 'channels/:guildId/:channelId/settings',
  //   component: SettingsModuleComponent,
  //   canActivate: [GuildAuthGuard],
  //   canDeactivate: [CanDeactivateDashboard]
  // },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

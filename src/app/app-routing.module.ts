import { Component, NgModule } from '@angular/core';
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
import { DevelopersComponent } from './pages/developers/developers.component';
import { ApplicationComponent } from './pages/developers/application/application.component';
import { BotUserComponent } from './pages/developers/bot-user/bot-user.component';
import { DevelopersAuthGuard } from './guards/developers-auth.guard';
import { VerifyComponent } from './authentication/verify/verify.component';
import { UserAccountComponent } from './dashboard/me/user-account/user-account.component';
import { InviteComponent } from './pages/invite/invite.component';
import { externalRedirect } from './utils/external-redirect';
import { environment } from 'src/environments/environment';
import { ComingSoonComponent } from './utils/coming-soon/coming-soon.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'auth/verify', component: VerifyComponent, },
  { path: 'auth', component: AuthComponent, },
  { path: 'changelog', component: externalRedirect(`${environment.docsURL}/general/changelog`), },
  { path: 'privacy', component: externalRedirect(`${environment.docsURL}/legal/privacy`), },
  { path: 'terms', component: externalRedirect(`${environment.docsURL}/legal/terms`), },
  {
    path: 'channels/@me',
    component: DashboardOverviewComponent,
    canActivate: [DashboardAuthGuard],
  },
  {
    path: 'channels/@me/settings',
    component: UserSettingsComponent,
    canActivate: [DashboardAuthGuard],
  },
  {
    path: 'channels/@me/settings/account',
    component: UserAccountComponent,
    canActivate: [DashboardAuthGuard],
  },
  {
    path: 'channels/@me/:channelId',
    component: DMChannelComponent,
    canActivate: [DMChannelAuthGuard, DashboardAuthGuard],
  },
  {
    path: 'channels/:guildId',
    component: GuildComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard],
  },
  {
    path: 'channels/:guildId/settings',
    component: GuildSettingsComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard],
  },
  {
    path: 'channels/:guildId/roles',
    component: RolesComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard],
  },
  {
    path: 'channels/:guildId/bots',
    component: ComingSoonComponent,
    // component: BotListComponent,
    // canActivate: [DashboardAuthGuard, GuildAuthGuard],
    // canDeactivate: [CanDeactivateDashboard],
  },
  {
    path: 'channels/:guildId/invites',
    component: InvitesComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard],
  },
  {
    path: 'channels/:guildId/:channelId',
    component: TextChannelComponent,
    canActivate: [DashboardAuthGuard, GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard],
  },
  { path: 'developers', component: ComingSoonComponent, },
  {
    path: `developers/applications/:id/user`,
    canActivate: [DevelopersAuthGuard],
    component: BotUserComponent,
  },
  {
    path: `developers/applications/:id`,
    canActivate: [DevelopersAuthGuard],
    component: ApplicationComponent,
  },
  { path: `developers/applications`, redirectTo: 'developers', },
  {
    path: 'developers',
    canActivate: [DevelopersAuthGuard],
    component: DevelopersComponent,
  },
  { path: 'invite/:id', component: InviteComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'logout', component: LogoutComponent, },
  { path: 'sign-up', component: SignUpComponent, },
  { path: '**', component: NotFoundComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

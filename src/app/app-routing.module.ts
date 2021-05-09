import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './authentication/auth/auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { DashboardOverviewComponent } from './dashboard/me/me-overview/me-overview.component';
import { GuildOverviewComponent } from './dashboard/guilds/guild-overview/guild-overview.component';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';
import { GuildAuthGuard } from './guards/guild-auth.guard';
import { CanDeactivateDashboard } from './guards/can-deactivate-dashboard.guard';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { TextChannelComponent } from './dashboard/guilds/text-channel/text-channel.component';
import { GuildSettingsComponent } from './dashboard/guilds/guild-settings/overview/guild-settings.component';
import { InvitesComponent } from './dashboard/guilds/guild-settings/invites/invites.component';
import { RolesComponent } from './dashboard/guilds/guild-settings/roles/roles.component';
import { DMChannelAuthGuard } from './guards/dmchannel-auth.guard';
import { DMComponent } from './dashboard/me/dmchannel/dm.component';
import { UserSettingsComponent } from './dashboard/me/user-settings/user-settings.component';
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
  { path: 'docs', component: externalRedirect(`${environment.docsURL}`), },
  { path: 'privacy', component: externalRedirect(`${environment.docsURL}/legal/privacy`), },
  { path: 'terms', component: externalRedirect(`${environment.docsURL}/legal/terms`), },
  {
    path: 'channels',
    canActivate: [DashboardAuthGuard],
    children: [
      {
        path: '@me',
        children: [
          { path: '', component: DashboardOverviewComponent },
          {
            path: ':channelId',
            component: DMComponent,
            canActivate: [DMChannelAuthGuard],
          },
          {
            path: 'settings',
            canDeactivate: [CanDeactivateDashboard],
            children: [
              { path: '', component: UserSettingsComponent },
              { path: 'account', component: UserAccountComponent },
            ]
          },
        ]
      },
      {
        path: ':guildId',
        canActivate: [GuildAuthGuard],
        children: [
          {
            path: ':channelId',
            children: [
              { path: '', component: GuildOverviewComponent },
              {
                path: 'settings',
                component: GuildSettingsComponent,
                canDeactivate: [CanDeactivateDashboard],
                children: [
                  { path: '', component: GuildSettingsComponent },
                  { path: 'roles', component: RolesComponent },
                  { path: 'invites', component: InvitesComponent },
                ],
              },
            ]
          },
        ]
      },
    ]
  },
  {
    path: 'dev',
    canActivate: [DevelopersAuthGuard],
    children: [
      { path: '', component: ComingSoonComponent },
      { path: 'apps', redirectTo: 'dev' },
      { path: 'apps/:id/user', component: BotUserComponent },
      { path: 'apps/:id', component: ApplicationComponent },
    ]
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

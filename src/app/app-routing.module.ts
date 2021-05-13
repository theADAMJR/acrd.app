import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { DashboardOverviewComponent } from './pages/channels/me/overview/me-overview.component';
import { GuildOverviewComponent } from './pages/channels/guild/overview/guild-overview.component';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';
import { GuildAuthGuard } from './guards/guild-auth.guard';
import { CanDeactivateDashboard } from './guards/can-deactivate-dashboard.guard';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { GuildSettingsComponent } from './pages/channels/guild/guild-settings/overview/guild-settings.component';
import { InvitesComponent } from './pages/channels/guild/guild-settings/invites/invites.component';
import { RolesComponent } from './pages/channels/guild/guild-settings/roles/roles.component';
import { DMChannelAuthGuard } from './guards/dmchannel-auth.guard';
import { DMComponent } from './pages/channels/me/dmchannel/dm.component';
import { UserSettingsComponent } from './pages/channels/me/settings/user-settings/user-settings.component';
import { ApplicationComponent } from './pages/dev/app/application.component';
import { BotUserComponent } from './pages/dev/bot-user/bot-user.component';
import { DevelopersAuthGuard } from './guards/developers-auth.guard';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { UserAccountComponent } from './pages/channels/me/settings/user-account/user-account.component';
import { InviteComponent } from './pages/invite/invite.component';
import { externalRedirect } from './utils/external-redirect';
import { environment } from 'src/environments/environment';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'auth/verify', component: VerifyComponent, },
  { path: 'auth', component: AuthComponent, },
  { path: 'changelog', component: externalRedirect(`${environment.docsURL}/general/changelog`), },
  { path: 'docs', component: externalRedirect(`${environment.docsURL}`), },
  { path: 'privacy', component: externalRedirect(`${environment.docsURL}/legal/privacy`), },
  { path: 'terms', component: externalRedirect(`${environment.docsURL}/legal/terms`), },
  { path: 'invite/:id', component: InviteComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'forgot-password', component: ForgotPasswordComponent, },
  { path: 'logout', component: LogoutComponent, },
  { path: 'sign-up', component: SignUpComponent, },
  {
    path: 'channels',
    canActivate: [DashboardAuthGuard],
    children: [
      {
        path: '@me',
        children: [
          { path: '', component: DashboardOverviewComponent },
          {
            path: 'settings',
            canDeactivate: [CanDeactivateDashboard],
            children: [
              { path: '', component: UserSettingsComponent },
              { path: 'account', component: UserAccountComponent },
            ]
          },
          {
            path: ':channelId',
            component: DMComponent,
            canActivate: [DMChannelAuthGuard],
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

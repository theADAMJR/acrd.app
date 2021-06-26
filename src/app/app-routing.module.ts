import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { GuildOverviewComponent } from './pages/channels/guild/overview/guild-overview.component';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';
import { GuildAuthGuard } from './guards/guild-auth.guard';
import { CanDeactivateDashboard } from './guards/can-deactivate-dashboard.guard';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { GuildSettingsComponent } from './pages/channels/guild/guild-settings/overview/guild-settings.component';
import { InvitesComponent } from './pages/channels/guild/guild-settings/invites/invites.component';
import { RolesComponent } from './pages/channels/guild/guild-settings/roles/roles.component';
import { InviteComponent } from './pages/invite/invite.component';
import { externalRedirect } from './utils/external-redirect';
import { environment } from 'src/environments/environment';
import { OverviewComponent } from './pages/channels/me/overview/overview.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'auth', component: AuthComponent, },
  { path: 'changelog', component: externalRedirect(`${environment.docsURL}/general/changelog`), },
  { path: 'docs', component: externalRedirect(`${environment.docsURL}`), },
  { path: 'privacy', component: externalRedirect(`${environment.docsURL}/legal/privacy`), },
  { path: 'status', component: externalRedirect(environment.statusURL), },
  { path: 'invite/:id', component: InviteComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'logout', component: LogoutComponent, },
  { path: 'sign-up', component: SignUpComponent, },
  {
    path: 'channels',
    canActivate: [DashboardAuthGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: ':guildId',
        canActivate: [GuildAuthGuard],
        children: [
          { path: '', component: GuildOverviewComponent },
          {
            path: ':channelId',
            component: GuildOverviewComponent,
          },
        ]
      },
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

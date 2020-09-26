import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardOverviewComponent } from './dashboard/dashboard-overview/dashboard-overview.component';
import { GuildComponent } from './dashboard/guild/guild.component';
import { DashboardAuthGuard } from './guards/dashboard-auth.guard';
import { GuildAuthGuard } from './guards/guild-auth.guard';
import { SettingsModuleComponent } from './dashboard/settings-module/settings-module.component';
import { LeaderboardAuthGuard } from './guards/leaderboard-auth.guard';
import { DocsComponent } from './docs/docs.component';
import { CanDeactivateDashboard } from './guards/can-deactivate-dashboard.guard';

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
    path: 'docs',
    component: DocsComponent
  },
  {
    path: 'docs/:page',
    component: DocsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },

  {
    path: 'channels',
    component: DashboardOverviewComponent,
    canActivate: [DashboardAuthGuard]
  },
  {
    path: 'channels/:guildId/:channelId',
    component: GuildComponent,
    canActivate: [GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: 'channels/:guildId/:channelId/settings',
    component: SettingsModuleComponent,
    canActivate: [GuildAuthGuard],
    canDeactivate: [CanDeactivateDashboard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

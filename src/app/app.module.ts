import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardOverviewComponent } from './dashboard/dashboard-overview/dashboard-overview.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { GuildComponent } from './dashboard/guild/guild.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { LogsModuleComponent } from './dashboard/logs-module/logs-module.component';
import { LogModuleComponent } from './dashboard/log-module/log-module.component';
import { SettingsModuleComponent } from './dashboard/settings-module/settings-module.component';
import { GuildSidebarComponent } from './dashboard/guild-sidebar/guild-sidebar.component';
import { DashboardSidebarComponent } from './dashboard/dashboard-sidebar/dashboard-sidebar.component';
import { MaterialModule } from './material-module';
import { SaveChangesComponent } from './dashboard/save-changes/save-changes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DocsComponent } from './docs/docs.component';
import { CleanDateTimePipe } from './pipes/clean-date-time.pipe';
import { MemberUsernameComponent } from './member-username/member-username.component';
import { DocsSidebarComponent } from './docs-sidebar/docs-sidebar.component';
import { ZippyComponent } from './zippy/zippy.component';
import { MiniDatePipe } from './pipes/mini-date.pipe';
import { environment } from 'src/environments/environment';
import { SnakeToSentenceCasePipe } from './pipes/snake-to-sentence-case.pipe';
import { TruncatedPipe } from './pipes/truncated.pipe';
import { DurationStringPipe } from './pipes/duration-string.pipe';
import { CamelToSentenceCasePipe } from './pipes/camel-to-sentence-case.pipe';
import { MessagePreviewComponent } from './message-preview/message-preview.component';
import { WavesComponent } from './waves/waves.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DashboardNavbarComponent } from './dashboard/dashboard-navbar/dashboard-navbar.component';
import { CreateGuildModalComponent } from './dashboard/create-guild-modal/create-guild-modal.component';
import { TextChannelComponent } from './dashboard/text-channel/text-channel.component';

@Injectable()
export class AlertErrorHandler implements ErrorHandler {
  async handleError(error: Error | any) {
    try {
      console.log(error?.rejection?.error ?? error?.message ?? error);

      const key = localStorage.getItem('key');
      await fetch(`${environment.endpoint}/error?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message })
      });
    } finally {
      console.log(error);
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    DashboardOverviewComponent,
    SidebarComponent,
    GuildComponent,
    SpinnerComponent,
    SettingsModuleComponent,
    GuildSidebarComponent,
    DashboardSidebarComponent,
    SaveChangesComponent,
    NotFoundComponent,
    DocsComponent,
    CleanDateTimePipe,
    MemberUsernameComponent,
    DocsSidebarComponent,
    ZippyComponent,
    MiniDatePipe,
    SnakeToSentenceCasePipe,
    TruncatedPipe,
    DurationStringPipe,
    CamelToSentenceCasePipe,
    MessagePreviewComponent,
    LogModuleComponent,
    LogsModuleComponent,
    WavesComponent,
    LoginComponent,
    SignUpComponent,
    DashboardNavbarComponent,
    CreateGuildModalComponent,
    TextChannelComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    HighlightModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: AlertErrorHandler },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

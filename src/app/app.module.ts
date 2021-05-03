import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthComponent } from './authentication/auth/auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { DashboardOverviewComponent } from './dashboard/me/me-overview/me-overview.component';
import { SidebarComponent } from './dashboard/components/sidebar/sidebar.component';
import { GuildOverviewComponent } from './dashboard/guilds/guild-overview/guild-overview.component';
import { SpinnerComponent } from './utils/spinner/spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { GuildSidebarComponent } from './dashboard/guilds/guild-sidebar/guild-sidebar.component';
import { MeSidebarComponent } from './dashboard/me/me-sidebar/me-sidebar.component';
import { MaterialModule } from './material-module';
import { SaveChangesComponent } from './dashboard/components/save-changes/save-changes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CleanDateTimePipe } from './pipes/clean-date-time.pipe';
import { MemberUsernameComponent } from './dashboard/components/member-username/member-username.component';
import { ZippyComponent } from './utils/zippy/zippy.component';
import { MiniDatePipe } from './pipes/mini-date.pipe';
import { environment } from 'src/environments/environment';
import { SnakeToSentenceCasePipe } from './pipes/snake-to-sentence-case.pipe';
import { TruncatedPipe } from './pipes/truncated.pipe';
import { DurationStringPipe } from './pipes/duration-string.pipe';
import { CamelToSentenceCasePipe } from './pipes/camel-to-sentence-case.pipe';
import { WavesComponent } from './utils/waves/waves.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { DashboardNavbarComponent } from './dashboard/components/dashboard-navbar/dashboard-navbar.component';
import { TextChannelComponent } from './dashboard/guilds/text-channel/text-channel.component';
import { VoiceChannelComponent } from './dashboard/guilds/voice-channel/voice-channel.component';
import { CreateInviteComponent } from './dialog/create-invite/create-invite.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { GuildSettingsComponent } from './dashboard/guilds/guild-settings/overview/guild-settings.component';
import { RolesComponent } from './dashboard/guilds/guild-settings/roles/roles.component';
import { InvitesComponent } from './dashboard/guilds/guild-settings/invites/invites.component';
import { FriendsListComponent } from './dashboard/me/friends-list/friends-list.component';
import { DMComponent } from './dashboard/me/dmchannel/dm.component';
import { UserSettingsComponent } from './dashboard/me/user-settings/user-settings.component';
import { BotListComponent } from './dashboard/guilds/guild-settings/bot-list/bot-list.component';
import { MessageEmbedComponent } from './dashboard/messages/message-embed/message-embed.component';
import { MessageComponent } from './dashboard/messages/message/message.component';
import { MemberListComponent } from './dashboard/guilds/member-list/member-list.component';
import { DevelopersComponent } from './pages/developers/developers.component';
import { ApplicationComponent } from './pages/developers/application/application.component';
import { BotUserComponent } from './pages/developers/bot-user/bot-user.component';
import { AvatarUrlComponent } from './dashboard/components/avatar-url/avatar-url.component';
import { VerifyComponent } from './authentication/verify/verify.component';
import { UserAccountComponent } from './dashboard/me/user-account/user-account.component';
import { SettingsSidebarComponent } from './dashboard/components/settings-sidebar/settings-sidebar.component';
import { UsernameValidators } from './authentication/sign-up/username.validators';
import { SubmarineComponent } from './pages/home/submarine/submarine.component';
import { InviteComponent } from './pages/invite/invite.component';
import { CountdownPipe } from './countdown.pipe';
import { CreateChannelComponent } from './dialog/create-channel/create-channel.component';
import { CreateGuildComponent } from './dialog/create-guild/create-guild.component';
import { ComingSoonComponent } from './utils/coming-soon/coming-soon.component';
import { LighthouseComponent } from './cool/lighthouse/lighthouse.component';
import { ChannelTabComponent } from './dashboard/components/channel-tab/channel-tab.component';
import { GuildNavbarComponent } from './dashboard/components/guild-navbar/guild-navbar.component';
import { ProfileComponent } from './dialog/profile/profile.component';
import { GuildIconComponent } from './dashboard/components/guild-icon/guild-icon.component';
import { AddFriendComponent } from './dialog/add-friend/add-friend.component';
import { WhyComponent } from './pages/why/why.component';
import { TimestampPipe } from './pipes/timestamp.pipe';

@Injectable()
export class AlertErrorHandler implements ErrorHandler {
  async handleError(error: Error) {
    try {
      console.log(error.stack);

      const key = localStorage.getItem('key');
      await fetch(`${environment.endpoint}/error?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error.message }),
      });
    } finally {
      throw error;
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
    GuildOverviewComponent,
    SpinnerComponent,
    GuildSidebarComponent,
    MeSidebarComponent,
    SaveChangesComponent,
    NotFoundComponent,
    CleanDateTimePipe,
    MemberUsernameComponent,
    ZippyComponent,
    MiniDatePipe,
    SnakeToSentenceCasePipe,
    TruncatedPipe,
    DurationStringPipe,
    CamelToSentenceCasePipe,
    MessageComponent,
    WavesComponent,
    LoginComponent,
    SignUpComponent,
    DashboardNavbarComponent,
    TextChannelComponent,
    VoiceChannelComponent,
    CreateInviteComponent,
    MessageEmbedComponent,
    GuildSettingsComponent,
    RolesComponent,
    InvitesComponent,
    FriendsListComponent,
    DMComponent,
    UserSettingsComponent,
    BotListComponent,
    MemberListComponent,
    DevelopersComponent,
    ApplicationComponent,
    BotUserComponent,
    AvatarUrlComponent,
    VerifyComponent,
    UserAccountComponent,
    SettingsSidebarComponent,
    SubmarineComponent,
    InviteComponent,
    CountdownPipe,
    CreateChannelComponent,
    CreateGuildComponent,
    ComingSoonComponent,
    LighthouseComponent,
    ChannelTabComponent,
    GuildNavbarComponent,
    ProfileComponent,
    GuildIconComponent,
    AddFriendComponent,
    WhyComponent,
    TimestampPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    InfiniteScrollModule,
    PickerModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: AlertErrorHandler },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

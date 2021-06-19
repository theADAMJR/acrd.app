import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { DashboardOverviewComponent } from './pages/channels/me/overview/me-overview.component';
import { SidebarComponent } from './pages/channels/components/sidebar/sidebar.component';
import { GuildOverviewComponent } from './pages/channels/guild/overview/guild-overview.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { GuildSidebarComponent } from './pages/channels/guild/sidebar/guild-sidebar.component';
import { MeSidebarComponent } from './pages/channels/me/sidebar/me-sidebar.component';
import { MaterialModule } from './material-module';
import { SaveChangesComponent } from './pages/channels/components/save-changes/save-changes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberUsernameComponent } from './pages/channels/components/member-username/member-username.component';
import { ZippyComponent } from './components/zippy/zippy.component';
import { environment } from 'src/environments/environment';
import { SnakeToSentenceCasePipe } from './pipes/snake-to-sentence-case.pipe';
import { DurationStringPipe } from './pipes/duration-string.pipe';
import { WavesComponent } from './components/waves/waves.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { DashboardNavbarComponent } from './pages/channels/components/dashboard-navbar/dashboard-navbar.component';
import { TextChannelComponent } from './pages/channels/guild/text-channel/text-channel.component';
import { CreateInviteComponent } from './components/dialog/create-invite/create-invite.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { GuildSettingsComponent } from './pages/channels/guild/guild-settings/overview/guild-settings.component';
import { RolesComponent } from './pages/channels/guild/guild-settings/roles/roles.component';
import { InvitesComponent } from './pages/channels/guild/guild-settings/invites/invites.component';
import { FriendsListComponent } from './pages/channels/me/friends-list/friends-list.component';
import { DMComponent } from './pages/channels/me/dmchannel/dm.component';
import { BotListComponent } from './pages/channels/guild/guild-settings/bot-list/bot-list.component';
import { MessageEmbedComponent } from './pages/channels/components/messages/message-embed/message-embed.component';
import { MessageComponent } from './pages/channels/components/messages/message/message.component';
import { MemberListComponent } from './pages/channels/guild/member-list/member-list.component';
import { ApplicationComponent } from './pages/dev/app/application.component';
import { BotUserComponent } from './pages/dev/bot-user/bot-user.component';
import { AvatarUrlComponent } from './pages/channels/components/avatar-url/avatar-url.component';
import { UserAccountComponent } from './pages/channels/me/settings/user-account/user-account.component';
import { SettingsSidebarComponent } from './pages/channels/components/settings-sidebar/settings-sidebar.component';
import { SubmarineComponent } from './components/cool/submarine/submarine.component';
import { InviteComponent } from './pages/invite/invite.component';
import { CreateChannelComponent } from './components/dialog/create-channel/create-channel.component';
import { CreateGuildComponent } from './components/dialog/create-guild/create-guild.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { LighthouseComponent } from './components/cool/lighthouse/lighthouse.component';
import { ChannelTabComponent } from './pages/channels/components/channel-tab/channel-tab.component';
import { ProfileComponent } from './components/dialog/profile/profile.component';
import { GuildIconComponent } from './pages/channels/components/guild-icon/guild-icon.component';
import { AddFriendComponent } from './components/dialog/add-friend/add-friend.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { ChangelogComponent } from './components/dialog/changelog/changelog.component';
import { AlertErrorHandler } from './alert-error.handler';
import { DevelopersComponent } from './pages/dev/developers.component';
import { UserSettingsComponent } from './pages/channels/me/settings/user-settings/user-settings.component';

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
    MemberUsernameComponent,
    ZippyComponent,
    SnakeToSentenceCasePipe,
    DurationStringPipe,
    MessageComponent,
    WavesComponent,
    LoginComponent,
    SignUpComponent,
    DashboardNavbarComponent,
    TextChannelComponent,
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
    UserAccountComponent,
    SettingsSidebarComponent,
    SubmarineComponent,
    InviteComponent,
    CreateChannelComponent,
    CreateGuildComponent,
    ComingSoonComponent,
    LighthouseComponent,
    ChannelTabComponent,
    ProfileComponent,
    GuildIconComponent,
    AddFriendComponent,
    TimestampPipe,
    ChangelogComponent,
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
  bootstrap: [AppComponent],
})
export class AppModule {}

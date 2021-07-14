import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { SidebarComponent } from './pages/channels/components/sidebar/sidebar.component';
import { GuildOverviewComponent } from './pages/channels/guild/overview/guild-overview.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { GuildSidebarComponent } from './pages/channels/guild/sidebar/guild-sidebar.component';
import { MaterialModule } from './material-module';
import { SaveChangesComponent } from './pages/channels/components/save-changes/save-changes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberUsernameComponent } from './pages/channels/components/member-username/member-username.component';
import { ZippyComponent } from './components/zippy/zippy.component';
import { SnakeToSentenceCasePipe } from './pipes/snake-to-sentence-case.pipe';
import { DurationStringPipe } from './pipes/duration-string.pipe';
import { WavesComponent } from './components/waves/waves.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { DashboardNavbarComponent } from './pages/channels/components/dashboard-navbar/dashboard-navbar.component';
import { TextChannelComponent } from './pages/channels/guild/text-channel/text-channel.component';
import { CreateInviteComponent } from './components/dialog/create-invite/create-invite.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MessageEmbedComponent } from './pages/channels/components/messages/message-embed/message-embed.component';
import { MessageComponent } from './pages/channels/components/messages/message/message.component';
import { MemberListComponent } from './pages/channels/guild/member-list/member-list.component';
import { ApplicationComponent } from './pages/dev/app/application.component';
import { BotUserComponent } from './pages/dev/bot-user/bot-user.component';
import { AvatarUrlComponent } from './pages/channels/components/avatar-url/avatar-url.component';
import { UserAccountComponent } from './components/dialog/user-settings/account/account.component';
import { SubmarineComponent } from './components/cool/submarine/submarine.component';
import { InviteComponent } from './pages/invite/invite.component';
import { CreateChannelComponent } from './components/dialog/create-channel/create-channel.component';
import { CreateGuildComponent } from './components/dialog/create-guild/create-guild.component';
import { LighthouseComponent } from './components/cool/lighthouse/lighthouse.component';
import { ChannelTabComponent } from './pages/channels/components/channel-tab/channel-tab.component';
import { ProfileComponent } from './components/dialog/profile/profile.component';
import { GuildIconComponent } from './pages/channels/components/guild-icon/guild-icon.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { ChangelogComponent } from './components/dialog/changelog/changelog.component';
import { AlertErrorHandler } from './alert-error.handler';
import { DevelopersComponent } from './pages/dev/developers.component';
import { OverviewComponent } from './pages/channels/me/overview/overview.component';
import { TabMenuComponent } from './components/dialog/tab-menu/tab-menu.component';
import { PreferencesComponent } from './components/dialog/user-settings/preferences/preferences.component';
import { ThemesComponent } from './components/dialog/themes/themes.component';
import { DevComponent } from './components/dialog/dev/dev.component';
import { ApplyComponent } from './components/dialog/themes/apply/apply.component';
import { CreateComponent } from './components/dialog/themes/create/create.component';
import { UserOverviewComponent } from './components/dialog/user-settings/overview/overview.component';
import { RolesComponent } from './components/dialog/guild-settings/roles/roles.component';
import { InvitesComponent } from './components/dialog/guild-settings/invites/invites.component';
import { UserSettingsComponent } from './components/dialog/user-settings/user-settings.component';
import { GuildSettingsComponent } from './components/dialog/guild-settings/guild-settings.component';
import { GuildSettingsOverviewComponent } from './components/dialog/guild-settings/overview/overview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    SidebarComponent,
    GuildOverviewComponent,
    SpinnerComponent,
    GuildSidebarComponent,
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
    MemberListComponent,
    DevelopersComponent,
    ApplicationComponent,
    BotUserComponent,
    AvatarUrlComponent,
    UserAccountComponent,
    SubmarineComponent,
    InviteComponent,
    CreateChannelComponent,
    CreateGuildComponent,
    LighthouseComponent,
    ChannelTabComponent,
    ProfileComponent,
    GuildIconComponent,
    TimestampPipe,
    ChangelogComponent,
    OverviewComponent,
    TabMenuComponent,
    PreferencesComponent,
    ThemesComponent,
    DevComponent,
    ApplyComponent,
    CreateComponent,
    UserOverviewComponent,
    RolesComponent,
    InvitesComponent,
    UserSettingsComponent,
    GuildSettingsComponent,
    GuildSettingsOverviewComponent,
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
    PickerModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AlertErrorHandler },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

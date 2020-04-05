import { model, Schema, Document } from 'mongoose';

export class Module {
    enabled = true;
}

export class AnnounceModule extends Module {
    events: AnnounceEvent[] = [];
}

export enum EventType { MemberJoin, MemberLeave, MessageDeleted }

export interface AnnounceEvent {
    event: EventType;
    channel: string;
    message: string;
}

export class AutoModModule extends Module {
    ignoreRoles: string[] = [];
    autoDeleteMessages = true;
    filters: MessageFilter[] = [];
    banWords: string[] = [];
    banLinks: string[] = [];
    autoWarnUsers = true;
}

export class CommandsModule {
    configs: CommandConfig[]
}

export enum MessageFilter { Words, Links }

export class GeneralModule extends Module {
    prefix = '/';
    ignoredChannels: string[] = [];
    autoRoles: string[] = [];
}

export class XPModule extends Module {
    levelRoles: LevelRole[] = [];
    ignoredRoles: string[] = [];
    xpPerMessage = 50;
    xpCooldown = 5;
}

export interface LevelRole {
    level: number;
    role: string;
}

export class MusicModule extends Module {
    
}

export interface CommandConfig {
    name: string;
    enabled: boolean;
}

export class DashboardSettings {
    privateLeaderboard = false;
}

const guildSchema = new Schema({
    _id: String,
    announce: { type: Object, default: new AnnounceModule() }, 
    autoMod: { type: Object, default: new AutoModModule() }, 
    commands: { type: Object, default: new CommandsModule() },
    general: { type: Object, default: new GeneralModule() },
    music: { type: Object, default: new MusicModule },
    xp: { type: Object, default: new XPModule() },
    settings: { type: Object, default: new DashboardSettings() }
});

export interface GuildDocument extends Document {
    _id: string;
    announce: AnnounceModule;
    autoMod: AutoModModule;
    general: GeneralModule;
    music: MusicModule;
    xp: XPModule;
    commands: CommandsModule;
    settings: DashboardSettings;
}

export const SavedGuild = model<GuildDocument>('guild', guildSchema);
